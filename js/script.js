document.addEventListener('DOMContentLoaded', () => {
  let menuLinks = document.querySelectorAll('.header__menu--link');
  let orderList = document.querySelector('.order__list');
  let header = document.querySelector('.header');
  let progressBar = document.querySelector('.form__progress');
  let progressLine = progressBar.querySelector('.form__progress--line');
  let progressSlider = progressBar.querySelector('.form__progress--slider');
  let progressValue = document.querySelector('.form__progress--value');
  let burger = document.querySelector('.header__burger');
  let menu = document.querySelector('.header__menu');
  let selected = document.querySelector('.form__select--options-selected');
  let optionsContainer = document.querySelector('.form__select--options-container');
  let optionsList = document.querySelectorAll('.form__select--options-item');
  let form = document.querySelector('.form');

  // фиксированный хедер
  window.onscroll = function() {myFunction()};
  let sticky = header.offsetTop;
  
  function myFunction() {
    if (window.pageYOffset >= sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

  // нажатая ссылка в хедере - поведение
  menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      menuLinks.forEach(menuLink => {
        menuLink.classList.remove('active');
      });
      link.classList.add('active');
    });
  });

  // подтягиваем пункты заказа из json
  fetch('./icons.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(icon => {
      let listItem = document.createElement('li');
      listItem.classList.add('order__item');
      let iconWrapper = document.createElement("div");
      iconWrapper.classList.add("order__item--img-wrapper");
      let img = document.createElement('img');
      img.classList.add('order__item--img');
      img.src = icon.path;
      img.alt = icon.alt;
      let text = document.createElement('p');
      text.classList.add('order__item--text');
      text.textContent = icon.text;

      iconWrapper.appendChild(img);
      listItem.appendChild(iconWrapper);
      listItem.appendChild(text);
      orderList.appendChild(listItem);
    });
  })
  .catch(error => console.error(error));

  // селект
  selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
  });

  optionsList.forEach(o => {
    o.addEventListener("click", () => {
      selected.innerHTML = o.querySelector('.form__select--options-label').innerHTML;
      optionsContainer.classList.remove("active");
    });
  });

  // прогресс-бар
  let isDragging = false;
  let progress = 0;

  function updateProgress(positionX) {
    let progressWidth = progressBar.offsetWidth;
    let progressLeft = progressBar.getBoundingClientRect().left;
    progress = Math.max(0, Math.min((positionX - progressLeft) / progressWidth, 1));
    progressLine.style.width = `${progress * 100}%`;
    progressSlider.style.left = `${progress * 100}%`;
    progressValue.textContent = `${Math.round(progress * 100)}%`;
    progressRange.value = progress * 100;
  }
  let progressRange = document.querySelector('#range');
  
  progressSlider.addEventListener('mousedown', (event) => {
    isDragging = true;
    updateProgress(event.pageX);
  });
  
  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      updateProgress(event.pageX);
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  progressBar.addEventListener('click', (event) => {
    updateProgress(event.pageX);
  });

  progressSlider.addEventListener('touchstart', (event) => {
    isDragging = true;
    updateProgress(event.touches[0].pageX);
  }, { passive: true });
  
  document.addEventListener('touchmove', (event) => {
    if (isDragging) {
      updateProgress(event.touches[0].pageX);
      event.preventDefault();
    }
  });
  
  document.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  progressBar.addEventListener('touchstart', (event) => {
    updateProgress(event.touches[0].pageX);
  }, { passive: true });
  
  updateProgress(0);

  // кнопка загрузки файла
  document.getElementById('file-upload').addEventListener('change', function () {
    var file = this.files[0];
    console.log('Выбранный файл:', file);
  });

  // форма
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(form.action, {
      method: form.method,
      body: new FormData(form)
    })
    .then(response => {
      // обрабатываем успешный ответ сервера
    })
    .catch(error => {
      // обрабатываем ошибку отправки данных на сервер
    });
  });


  // бургер
  burger && burger.addEventListener('click', (e) => {
    e.preventDefault();
    burger.classList.toggle('touched');
    document.body.classList.toggle('noscroll');
    menu.classList.toggle('visible');
  });

  for (let i = 0; i < menuLinks.length; i++) {
    menuLinks[i].addEventListener('click', (e) => {
      e.preventDefault();
      burger.classList.remove('touched');
      document.body.classList.remove('noscroll');
      menu.classList.remove('visible');
    });
  }

})