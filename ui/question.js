const voteCells = document.getElementsByClassName('vote_cell');
for (let i = 0; i < voteCells.length; i += 1) {
  const upBtns = voteCells[i].getElementsByClassName('up_vote');
  const currentUpButton = upBtns[0];
  currentUpButton.addEventListener('click', () => {
    currentUpButton.classList.toggle('activeup');
  });

  const downBtns = voteCells[i].getElementsByClassName('down_vote');
  const currentDownButton = downBtns[0];
  currentDownButton.addEventListener('click', () => {
    currentDownButton.classList.toggle('activedown');
  });
}
