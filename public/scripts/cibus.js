'use strict';

const utils = window.__cutTheCutlery__;

const selectors = {
  cutleryCheckbox: '#ksf-1',
  notesForRestaurantTextbox: 'textarea[placeholder="הבקשות יתקבלו בהתאם ליכולות המסעדה"]',
  checkoutRightSection: '.order-table.right-order-data',
  cutTheCutleryInfo: '#cut-the-cutlery-info',
  checkoutSubmitButton: 'a.button.send'
};

const cutleryAvoider = {
  init: () => {
    cutleryAvoider.handlePageLoad();
  },
  handlePageLoad: () => {
    utils.elementRenderListener.listenElementRender({
      selector: selectors.cutleryCheckbox,
      onRenderCallback: (cutleryCheckbox) => {
        cutleryAvoider.uncheckCutleryCheckbox(cutleryCheckbox);
      }
    });

    utils.elementRenderListener.listenElementRender({
      selector: selectors.notesForRestaurantTextbox,
      onRenderCallback: (notesForRestaurantTextbox) => {
        cutleryAvoider.addNoteNoCutlery(notesForRestaurantTextbox);
      }
    });

    cutleryAvoider.appendCheckoutInfoElement();

    utils.elementRenderListener.listenElementRender({
      selector: selectors.checkoutSubmitButton,
      onRenderCallback: (checkoutSubmitButton) => {
        checkoutSubmitButton.addEventListener('click', () => {
          if (cutleryAvoider.isCutleryCheckboxUnchecked()) {
            utils.countApi.hit();
          }
        });
      }
    });
  },
  uncheckCutleryCheckbox: (cutleryCheckbox) => {
    if (cutleryCheckbox.checked) {
      cutleryCheckbox.click();
    }
  },
  addNoteNoCutlery: (notesForRestaurantTextbox) => {
    notesForRestaurantTextbox.value += '❌🍴 ללא סכו"ם בבקשה 🍴❌';
  },
  appendCheckoutInfoElement: () => {
    utils.countApi.get().then(({ status, value }) => { 
      if (status === 200) {
        const element = cutleryAvoider.getCheckoutInfoElement(value);
        document.querySelector(selectors.checkoutRightSection).append(element);
      }
    });
  },
  getCheckoutInfoElement: (currentCutsCount) => {
    const element = document.createElement('div');
    element.id = selectors.cutTheCutleryInfo.substring(1);

    // content
    const firstRow = document.createElement('span');
    firstRow.append(`כבר סימנו בשבילך ללא חד פעמי 💚`);
    element.append(firstRow);

    element.append(document.createElement('br'));

    const secondRow = document.createElement('span');
    const currentCutsCountStringified = currentCutsCount.toLocaleString('en-US');
    const nextCutsCountStringified = (currentCutsCount + 1).toLocaleString('en-US');
    secondRow.append(`עד היום חסכנו ${currentCutsCountStringified} סכו"ם חד פעמי, רוצה להיות ה-${nextCutsCountStringified}?`);
    element.append(secondRow);

    // style
    const rowStyle = {
      backgroundColor: '#254827',
      padding: '0 4px',
      color: 'white',
      letterSpacing: '0.5px'
    };
    Object.assign(firstRow.style, rowStyle);
    Object.assign(secondRow.style, rowStyle);
    
    const backgroundImageUrl = chrome.extension.getURL('images/plants-background.jpg');
    const elementStyle = { 
      textAlign: 'center',
      marginTop: '-20px',
      marginRight: '35px',
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundColor: '#254827',
      padding: '8px',
      lineHeight: '18px',
      borderRadius: '5px'
    };
    Object.assign(element.style, elementStyle);

    const linkWrapper = document.createElement('a');
    linkWrapper.title = '#shameless_advertising';
    linkWrapper.href = 'https://www.linkedin.com/in/eylon-basirtman/';
    linkWrapper.target = '_blank';
    linkWrapper.append(element);

    return linkWrapper;
  },
  isCutleryCheckboxUnchecked: () => {
    const cutleryCheckbox = document.querySelector(selectors.cutleryCheckbox);
    return cutleryCheckbox !== null && !cutleryCheckbox.checked;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDOMLoad);
} else {
  handleDOMLoad();
}

function handleDOMLoad() {
  cutleryAvoider.init();
}