const formList = document.querySelectorAll('form');
const loanApplicationDetails = {};

formList.forEach((form, index) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { elements } = form;
    for (let i = 0; i < elements.length - 1; i += 1) {
      const item = elements.item(i);
      loanApplicationDetails[item.name] = item.value;
    }
    form.classList.toggle('closed');
    const next = index + 1;
    if (next < formList.length) {
      formList[next].classList.toggle('closed');
    } else {
      console.log(loanApplicationDetails);
    }
  });
});
