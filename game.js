$(document).ready(function () {
    // Load the story JSON file
    $.getJSON('story.json', function (data) {
      // Initialize the game with the starting point
      let currentPoint = 'start';
  
      // Function to update the game based on the current point
      function updateGame() {
        const pointData = data[currentPoint];
  
        // Update the narrative text
        $('#narrative-text').text(pointData.text);
  
        // Update the choices
        if (pointData.choices) {
          $('#choice1-button').text(pointData.choices.choice1).show();
          $('#choice2-button').text(pointData.choices.choice2).show();
        } else {
          $('#choice1-button').hide();
          $('#choice2-button').hide();
        }
  
        // Update the game status
        if (pointData.status) {
          $('#status-text').text('Status: ' + (pointData.status === 'won' ? 'You Won!' : 'You Lost!'));
        } else {
          $('#status-text').text('Status: Playing');
        }
      }
  
      // Initialize the game
      updateGame();
  
      // Handle choice buttons
      $('#choice1-button').click(function () {
        currentPoint = data[currentPoint].next.choice1;
        updateGame();
      });
      $('#choice2-button').click(function () {
        currentPoint = data[currentPoint].next.choice2;
        updateGame();
      });
    });
  });
  