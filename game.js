// Initial game state
let gameState = {
    currentscene: 'start',  // Lowercase
    health: 100,
    inventory: [],
    clothing: [],
    helmet: [],
    weapon: [],
    weightcapacity: 50,  // Lowercase
    currentweight: 0,  // Lowercase
    clue: []
};

// Function to update the displayed stats
function updateStats() {
    $('#health-stat').text(gameState.health);
    $('#inventory-stat').text(gameState.inventory.join(', ') || 'Empty');
    $('#clothing-stat').text(gameState.clothing.join(', ') || 'Basic Clothes');
    $('#helmet-stat').text(gameState.helmet.join(', ') || 'None');
    $('#weapon-stat').text(gameState.weapon.join(', ') || 'None');
}

// Function to add an item to the inventory
function addItemToInventory(item) {
    const itemTypeLower = item.type.toLowerCase();  // Convert to lowercase
    if (gameState.currentWeight + item.weight <= gameState.weightCapacity) {
        gameState.currentWeight += item.weight;
        gameState[itemTypeLower].push(item.name);  // Use the lowercase version
        updateStats();
        return true;
    }
    return false;
}

// Function to check if the conditions for displaying a choice are met
function checkChoiceConditions(choice) {
    if (choice.conditions) {
        for (const condition of choice.conditions) {
            const conditionTypeLower = condition.type.toLowerCase();  // Convert to lowercase
            if (!gameState[conditionTypeLower].includes(condition.value)) {  // Use the lowercase version
                return false;
            }
        }
    }
    return true;
}


// Function to display the scene based on game state
function displayScene(scene, story) {
    $('#narrative-text').text(scene.narrative);
    $('#choices-section').empty();

    for (const choice of scene.choices) {
        const choiceButton = $('<button class="btn btn-primary mb-2 mr-2"></button>');
        choiceButton.text(choice.text);

        choiceButton.click(() => {
            let nextScene = choice.nextScene;

            if (choice.conditions) {
                let conditionMet = true;

                for (const condition of choice.conditions) {
                    if (condition.type === 'inventory') {
                        if (!gameState.inventory.includes(condition.value)) {
                            conditionMet = false;
                        }
                    }
                    if (condition.type === 'clothing') {
                        if (!gameState.clothing.includes(condition.value)) {
                            conditionMet = false;
                        }
                    }
                    if (condition.type === 'weapon') {
                        if (!gameState.weapon.includes(condition.value)) {
                            conditionMet = false;
                        }
                    }
                }

                if (!conditionMet && choice.alternateScene) {
                    nextScene = choice.alternateScene;
                }
            }

            if (choice.items) {
                for (const item of choice.items) {
                    addItemToInventory(item);
                }
            }

            if (choice.effect) {
                gameState.health += choice.effect.health || 0;
            }
            gameState.currentScene = nextScene;
            displayScene(story.scenes[nextScene], story);
        });

        $('#choices-section').append(choiceButton);
    }

    updateStats();
}

// Main function to start the game
$(document).ready(() => {
    $.getJSON('story.json', function (data) {
        const story = data;

        gameState.currentScene = 'start';  // Initialize the starting scene in the game state
        displayScene(story.scenes[gameState.currentScene], story);  // Start the game with the initial scene, pass 'story' as a parameter
    });
});
