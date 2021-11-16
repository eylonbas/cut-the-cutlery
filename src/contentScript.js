'use strict';
import countapi from 'countapi-js';

const cutleryAvoider = {
  counter: {
    namespace: 'cut-the-cutlery',
    key: 'checkouts-with-no-cutlery'
  },
  selectors: {
    proceedToCheckoutButton: '[data-test-id="proceedToCheckoutBtn"]',
    noCutleryCheckbox: '#dont_want_cutlery',
    noCutleryLabel: 'label[for="dont_want_cutlery"]',
    cutTheCutleryInfo: '#cut-the-cutlery-info',
    confirmCheckoutButton: 'TBD' // todo
  },
  init: () => {
    cutleryAvoider.listenProceedToCheckoutRender();
    locationPathNameListener.listen(() => {
      cutleryAvoider.listenProceedToCheckoutRender();
    });
  },
  listenProceedToCheckoutRender: () => {
    elementRenderListener.listenElementRender({
      selector: cutleryAvoider.selectors.proceedToCheckoutButton,
      onRenderCallback: (proceedToCheckoutButton) => {
        proceedToCheckoutButton.addEventListener('click', cutleryAvoider.handleProceedToCheckoutClick);
      }
    });
  },
  handleProceedToCheckoutClick: () => {
    elementRenderListener.listenElementRender({
      selector: cutleryAvoider.selectors.noCutleryCheckbox,
      onRenderCallback: (noCutleryCheckbox) => {
        cutleryAvoider.checkDontWantCutlery(noCutleryCheckbox);
      }
    });
    elementRenderListener.listenElementRender({
      selector: cutleryAvoider.selectors.confirmCheckoutButton,
      onRenderCallback: (confirmCheckoutButton) => {
        confirmCheckoutButton.addEventListener('click', () => {
          if (cutleryAvoider.isNoCutleryCheckboxChecked()) {
            countapi.hit(cutleryAvoider.counter.namespace, cutleryAvoider.counter.key);
          }
        });
      }
    });
  },
  checkDontWantCutlery: (noCutleryCheckbox) => {
    if (!noCutleryCheckbox.checked) {
      noCutleryCheckbox.click();
    }
    if (document.querySelector(cutleryAvoider.selectors.cutTheCutleryInfo) === null) {
      cutleryAvoider.appendCheckoutInfoElement();
    }
  },
  appendCheckoutInfoElement: () => {
    countapi.get(cutleryAvoider.counter.namespace, cutleryAvoider.counter.key).then(({ status, value }) => { 
      if (status === 200) {
        const element = cutleryAvoider.getCheckoutInfoElement(value);
        const noCutlerySection = document.querySelector(cutleryAvoider.selectors.noCutleryLabel).parentElement.parentElement.parentElement;
        noCutlerySection.after(element);
      }
    });
  },
  getCheckoutInfoElement: (currentCutsCount) => {
    const element = document.createElement('div');
    element.id = cutleryAvoider.selectors.cutTheCutleryInfo.substring(1);

    // content
    element.append(`כבר סימנו בשבילך ללא חד פעמי ♥️`);
    element.append(document.createElement('br'));
    element.append(`עד היום חסכנו ${currentCutsCount} סכו"ם חד פעמי, רוצה להיות ה-${currentCutsCount + 1}?`);

    // style
    const elementStyle = { 
      textAlign: 'center',
      marginTop: '6px',
      backgroundColor: 'green',
      color: '#f4fdf4',
      padding: '5px',
      lineHeight: '18px'
    };
    Object.assign(element.style, elementStyle);

    return element;
  },
  isNoCutleryCheckboxChecked: () => {
    const noCutleryCheckbox = document.querySelector(cutleryAvoider.selectors.noCutleryCheckbox);
    return noCutleryCheckbox !== null && noCutleryCheckbox.checked;
  }
};

const locationPathNameListener = {
  lastDetectedValue: null,
  listen: (callback) => {
    locationPathNameListener.lastDetectedValue = locationPathNameListener.getCurrentValue();
    locationPathNameListener.checkContinuously(callback);
  },
  checkContinuously: (callback) => {
    setInterval(() => {
      const currentValue = locationPathNameListener.getCurrentValue();
      if (locationPathNameListener.lastDetectedValue !== currentValue) {
        callback({ prev: locationPathNameListener.lastDetectedValue, new: currentValue });
        locationPathNameListener.lastDetectedValue = currentValue;
      }
    }, 200);
  },
  getCurrentValue: () => {
    return window.location.pathname;
  }
};

const elementRenderListener = {
  intervalsCount: 0,
  intervals: {},
  listenElementRender: ({ selector, onRenderCallback }) => {
    const intervalKey = elementRenderListener.createIntervalUniqueKey();

    elementRenderListener.intervals[intervalKey] = setInterval(() => {
      elementRenderListener.handleElementRenderInterval({ intervalKey, selector, onRenderCallback });
    }, 200);
  },
  handleElementRenderInterval: ({ intervalKey, selector, onRenderCallback }) => {
    const element = document.querySelector(selector);
    if (element !== null) {
      clearInterval(elementRenderListener.intervals[intervalKey]);
      onRenderCallback(element);
    }  
  },
  createIntervalUniqueKey: () => {
    return `interval-${ ++elementRenderListener.intervalsCount }`;
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