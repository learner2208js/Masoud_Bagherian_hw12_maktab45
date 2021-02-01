$(document).ready(function () {
  let cards = [];
  const itemPerPage = 6;
  let currentUser = {};
  let currentPage;

  /* ----------------------- */
  /*      DOM variables      */
  /* ----------------------- */

  const backdrop = $('#backdrop');

  const profile = {
    modal: $('#profile-modal'),
    image: $('#profile-image'),
    firstName: $('#profile-firstname'),
    lastName: $('#profile-lastname'),
    email: $('#profile-email'),
    imageBtn: $('#profile-image-btn'),
    imageSelector: $('#profile-image-selector'),
    imageAlert: $('#profile-image-alert'),
    form: $('#profile-form'),
    updateBtn: $('#profile-update-btn'),
    deleteBtn: $('#profile-delete-btn'),
    cancelBtn: $('#profile-cancel-btn'),
  };

  const addBox = {
    modal: $('#add-box-modal'),
    image: $('#add-box-image'),
    firstName: $('#add-box-firstname'),
    lastName: $('#add-box-lastname'),
    email: $('#add-box-email'),
    imageBtn: $('#add-box-image-btn'),
    imageSelector: $('#add-box-image-selector'),
    imageAlert: $('#add-box-image-alert'),
    form: $('#add-box-form'),
    insertBtn: $('#add-box-insert-btn'),
    cancelBtn: $('#add-box-cancel-btn'),
  };

  /* --------------------------- */
  /*      end DOM variables      */
  /* --------------------------- */

  /* ------------------- */
  /*      functions      */
  /* ------------------- */

  function init() {
    $.ajax({
      method: 'get',
      url: 'https://reqres.in/api/users?page=1',
      success: function (pageOne) {
        $.ajax({
          method: 'get',
          url: 'https://reqres.in/api/users?page=2',
          success: function (pageTwo) {
            cards = pageOne.data.concat(pageTwo.data);
            currentPage = 1;
            createPagination(getPageCount());
            showPage(getPageCards(1));
            // activePaginationBtn();
          },
        });
      },
    });
  }

  // number of all pages
  function getPageCount() {
    return Math.ceil(cards.length / itemPerPage);
  }
  // cards in page number = pageIndex
  // pageIndex starts with 1
  function getPageCards(pageIndex) {
    pageCount = getPageCount();
    // check if pageIndex is final page or not
    if (pageIndex !== pageCount) {
      return cards.filter(
        (card, index) =>
          index >= (pageIndex - 1) * itemPerPage &&
          index < pageIndex * itemPerPage
      );
    } else {
      return cards.filter(
        (card, index) =>
          index >= (pageIndex - 1) * itemPerPage && index < cards.length
      );
    }
  }

  // create pagination
  function createPagination(pageCount) {
    const pagination = $('#pagination');
    pagination.html('');
    for (let i = 1; i <= pageCount; i++) {
      const btn = document.createElement('button');
      btn.className = 'pagination__btn';
      btn.textContent = i;
      btn.dataset.pageIndex = i;
      pagination.append(btn);
    }
    activePaginationBtn();
  }
  // create current page content
  function showPage(cardSet) {
    const usersContainer = document.getElementById('users');
    usersContainer.innerHTML = '';
    cardSet.forEach((card) => {
      const userCard = mkSingleCard(card);
      usersContainer.innerHTML += userCard;
    });
  }

  // create one card in the current page
  function mkSingleCard(card) {
    const cardContainer = `<div class="user-wrapper col-sm-6 col-md-4 col-lg-3">
    <div class="user" data-user-id="${card.id}" >
      <div class="user__image">
        <img src="${card.avatar}" alt="" class="img" />
      </div>
      <div class="user__body">
        <div class="user__info">
          <div class="user__id">id:<span class="id">${card.id}</span></div>
          <div class="user__name">
            <span class="first-name">${card['first_name']}</span
            ><span class="last-name">${card['last_name']}</span>
          </div>
          <div class="user__email">
            email: <span class="address">${card.email}</span>
          </div>
        </div>
        <button class="user__btn">user profile</button>
      </div>
    </div>
  </div>
  `;
    return cardContainer;
  }

  function showBackdrop() {
    backdrop.addClass('active');
  }
  function hideBackdrop() {
    backdrop.removeClass('active');
  }
  function showProfileModal() {
    profile.modal.addClass('active');
  }
  function hideProfileModal() {
    profile.modal.removeClass('active');
  }
  function showAddBox() {
    addBox.modal.addClass('active');
  }
  function hideAddbox() {
    addBox.modal.removeClass('active');
  }

  function reset() {
    hideBackdrop();
    hideProfileModal();
    hideAddbox();
    removeProfileAlerts();
    removeAddBoxAlerts();
    profile.updateBtn.removeClass('disabled');
    addBox.insertBtn.removeClass('disabled');
  }
  function removeProfileAlerts() {
    $('.profile__alert').removeClass('active');
  }
  function removeAddBoxAlerts() {
    $('.add-box__alert').removeClass('active');
  }

  function fillProfileModal(id) {
    const { image, firstName, lastName, email } = profile;
    user = getCard(id);
    image.attr('src', user.avatar);
    firstName.val(user['first_name']);
    lastName.val(user['last_name']);
    email.val(user['email']);
  }
  function getCard(id) {
    return cards.find((card) => card.id === id);
  }

  function checkProfileInputsFilled() {
    let allFilled = true;
    profile.form.find('.profile__input').each(function () {
      if ($(this).val().trim() === '') {
        allFilled = false;
      }
    });
    return allFilled;
  }
  function checkAddBoxInputsFilled() {
    let allFilled = true;
    addBox.form.find('.add-box__input').each(function () {
      if ($(this).val().trim() === '') {
        allFilled = false;
      }
    });
    return allFilled;
  }

  function activePaginationBtn() {
    $('.pagination__btn').removeClass('active');
    $('.pagination__btn').each(function () {
      if (+$(this).attr('data-page-index') === currentPage) {
        $(this).addClass('active');
      }
    });
  }

  function showAddBoxAlerts() {
    $('.add-box__input').each(function () {
      if ($(this).val() === '') {
        showAlert($(this), '.add-box__alert');
      }
    });
  }

  function showAlert(input, alertClassName) {
    input.siblings(alertClassName).addClass('active');
  }
  function hideAlert(input, alertClassName) {
    input.siblings(alertClassName).removeClass('active');
  }
  function emptyAddBoxInputs() {
    $('.add-box__input').val('');
  }

  function setNewId() {
    if (cards.length === 0) {
      return 1;
    } else {
      const maxId = Math.max(...cards.map((card) => card.id));
      return maxId + 1;
    }
  }

  /* ----------------------- */
  /*      end functions      */
  /* ----------------------- */

  /* 
    get data from api
    create initial pagination
    show the first page
  */
  init();

  /* ------------------------- */
  /*      event listeners      */
  /* ------------------------- */

  // toggle navbar by clicking on hamburger icon
  $('#toggle-btn').click(function () {
    const menuHeight = $('#nav .nav-body').innerHeight();
    $(this).toggleClass('active');
    if ($('#nav').innerHeight() === 0) {
      $('#nav').css('height', `${menuHeight}px`);
    } else {
      $('#nav').css('height', '0');
    }
  });
  // change page by clicking on pagination buttons
  $('#pagination').click(function (e) {
    const btn = $(e.target);
    if (btn.hasClass('pagination__btn')) {
      const pageIndex = +btn.attr('data-page-index');
      currentPage = pageIndex;
      activePaginationBtn();
      showPage(getPageCards(pageIndex));
    }
    return false;
  });

  // open user profile modal window by clicking on user profile button
  $('#users').click(function (e) {
    const profileBtn = $(e.target);
    // profile button clicked
    if (profileBtn.hasClass('user__btn')) {
      const user = profileBtn.parents('.user');
      currentUser.id = +user.attr('data-user-id');
      fillProfileModal(currentUser.id);
      showBackdrop();
      showProfileModal();
    }
  });
  // open a modal window to add a user
  $('#add-btn').click(function () {
    showBackdrop();
    emptyAddBoxInputs();
    addBox.image.attr('src', 'assets/image/user-avatar.jpg');
    showAddBox();
  });
  backdrop.click(function () {
    reset();
  });
  // select an image by clicking on camera icon
  profile.imageBtn.click(function () {
    profile.imageSelector.click();
  });
  // set image selected by profile image selector
  profile.imageSelector.change(function (e) {
    const fileName = $(e.target).val();
    const lastDot = fileName.lastIndexOf('.') + 1;
    const format = fileName.substr(lastDot, fileName.length);
    if (
      format.toLowerCase() !== 'jpg' &&
      format.toLowerCase() !== 'jpeg' &&
      format.toLowerCase() !== 'png'
    ) {
      profile.imageAlert.addClass('active');
      setTimeout(function () {
        profile.imageAlert.removeClass('active');
      }, 2000);
      $(e.target).val('');
      return;
    }

    const user = getCard(currentUser.id);
    const path = URL.createObjectURL(e.target.files[0]);
    profile.image.attr('src', path);
  });

  profile.updateBtn.click(function () {
    if (!checkProfileInputsFilled()) {
      return;
    }

    const { email, firstName, lastName, image } = profile;
    const user = getCard(currentUser.id);
    user.email = email.val();
    user['first_name'] = firstName.val();
    user['last_name'] = lastName.val();
    user['avatar'] = image.attr('src');
    showPage(getPageCards(currentPage));
    reset();
  });

  profile.deleteBtn.click(function () {
    const currentCard = getCard(currentUser.id);
    const index = cards.findIndex((card) => card === currentCard);
    const prevPageCount = getPageCount();
    cards.splice(index, 1);
    const nextPageCount = getPageCount();
    showPage(getPageCards(currentPage));
    // all final page cards removed
    if (prevPageCount !== nextPageCount) {
      createPagination(nextPageCount);

      //
      if (currentPage === prevPageCount) {
        showPage(getPageCards(nextPageCount));
        currentPage = nextPageCount;
        activePaginationBtn();
      }
    }
    reset();
  });

  profile.cancelBtn.click(function () {
    reset();
  });
  profile.form.submit(function (e) {
    e.preventDefault();
  });

  profile.form.on('input', function (e) {
    const input = $(e.target);
    if (input.val().trim() === '') {
      showAlert(input, '.profile__alert');
    } else {
      hideAlert(input, '.profile__alert');
    }
    if (!checkProfileInputsFilled()) {
      profile.updateBtn.addClass('disabled');
    } else {
      profile.updateBtn.removeClass('disabled');
    }
  });

  addBox.imageBtn.click(function () {
    addBox.imageSelector.click();
  });
  // set image selected by profile image
  addBox.imageSelector.change(function (e) {
    const fileName = $(e.target).val();
    const lastDot = fileName.lastIndexOf('.') + 1;
    const format = fileName.substr(lastDot, fileName.length);
    if (
      format.toLowerCase() !== 'jpg' &&
      format.toLowerCase() !== 'jpeg' &&
      format.toLowerCase() !== 'png'
    ) {
      addBox.imageAlert.addClass('active');
      setTimeout(function () {
        addBox.imageAlert.removeClass('active');
      }, 2000);
      $(e.target).val('');
      return;
    }

    // const user = getCard(currentUser.id);
    const path = URL.createObjectURL(e.target.files[0]);
    addBox.image.attr('src', path);
  });

  addBox.insertBtn.click(function () {
    if (!checkAddBoxInputsFilled()) {
      showAddBoxAlerts();
      addBox.insertBtn.addClass('disabled');
      return;
    }

    const { email, firstName, lastName, image } = addBox;
    const newCard = {};
    newCard.email = email.val();
    newCard['first_name'] = firstName.val();
    newCard['last_name'] = lastName.val();
    newCard['avatar'] = image.attr('src');
    newCard.id = setNewId();
    // showPage(getPageCards(currentPage));
    cards.push(newCard);
    if (cards.length % itemPerPage === 1) {
      currentPage = getPageCount();
      createPagination(getPageCount());
      showPage(getPageCards(getPageCount()));
    } else {
      showPage(getPageCards(getPageCount()));
      currentPage = getPageCount();
      activePaginationBtn();
    }

    reset();
  });

  addBox.cancelBtn.click(function () {
    reset();
  });
  addBox.form.on('input', function (e) {
    const input = $(e.target);
    if (input.val().trim() === '') {
      showAlert(input, '.add-box__alert');
    } else {
      hideAlert(input, '.add-box__alert');
    }
    if (!checkAddBoxInputsFilled()) {
      addBox.insertBtn.addClass('disabled');
    } else {
      addBox.insertBtn.removeClass('disabled');
    }
  });
  addBox.form.submit(function (e) {
    e.preventDefault();
  });

  /* ----------------------------- */
  /*      end event listeners      */
  /* ----------------------------- */
});
// end ready function
