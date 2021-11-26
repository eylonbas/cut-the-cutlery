'use strict';

const utils = window.__cutTheCutlery__;

const selectors = {
  proceedToCheckoutButton: '[data-test-id="proceedToCheckoutBtn"]',
  noCutleryCheckbox: '#dont_want_cutlery',
  noCutleryLabel: 'label[for="dont_want_cutlery"]',
  cutTheCutleryInfo: '#cut-the-cutlery-info',
  checkoutSubmitButton: '[data-test-id="checkoutSubmitOrderBtn"]'
};

const cutleryAvoider = {
  init: () => {
    cutleryAvoider.listenProceedToCheckoutRender();
    utils.locationPathNameListener.listen(() => {
      cutleryAvoider.listenProceedToCheckoutRender();
    });
  },
  listenProceedToCheckoutRender: () => {
    utils.elementRenderListener.listenElementRender({
      selector: selectors.proceedToCheckoutButton,
      onRenderCallback: (proceedToCheckoutButton) => {
        proceedToCheckoutButton.addEventListener('click', cutleryAvoider.handleProceedToCheckoutClick);
      }
    });
  },
  handleProceedToCheckoutClick: () => {
    utils.elementRenderListener.listenElementRender({
      selector: selectors.noCutleryCheckbox,
      onRenderCallback: (noCutleryCheckbox) => {
        cutleryAvoider.checkDontWantCutlery(noCutleryCheckbox);
      }
    });
    utils.elementRenderListener.listenElementRender({
      selector: selectors.checkoutSubmitButton,
      onRenderCallback: (checkoutSubmitButton) => {
        checkoutSubmitButton.addEventListener('click', () => {
          if (cutleryAvoider.isNoCutleryCheckboxChecked()) {
            utils.countApi.hit();
          }
        });
      }
    });
  },
  checkDontWantCutlery: (noCutleryCheckbox) => {
    if (!noCutleryCheckbox.checked) {
      noCutleryCheckbox.click();
    }
    if (document.querySelector(selectors.cutTheCutleryInfo) === null) {
      cutleryAvoider.appendCheckoutInfoElement();
    }
  },
  appendCheckoutInfoElement: () => {
    utils.countApi.get().then(({ status, value }) => { 
      if (status === 200) {
        const element = cutleryAvoider.getCheckoutInfoElement(value);
        const noCutlerySection = document.querySelector(selectors.noCutleryLabel).parentElement.parentElement.parentElement;
        noCutlerySection.after(element);
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
      marginTop: '6px',
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundColor: '#254827',
      padding: '8px',
      lineHeight: '18px'
    };
    Object.assign(element.style, elementStyle);

    const linkWrapper = document.createElement('a');
    linkWrapper.title = '#shameless_advertising';
    linkWrapper.href = 'https://www.linkedin.com/in/eylon-basirtman/';
    linkWrapper.target = '_blank';
    linkWrapper.append(element);

    return linkWrapper;
  },
  isNoCutleryCheckboxChecked: () => {
    const noCutleryCheckbox = document.querySelector(selectors.noCutleryCheckbox);
    return noCutleryCheckbox !== null && noCutleryCheckbox.checked;
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