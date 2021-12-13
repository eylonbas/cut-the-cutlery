'use strict';
import countapi from 'countapi-js';

const countApiHandler = {
    consts: {
        namespace: 'cut-the-cutlery',
        key: 'checkouts-with-no-cutlery'
    },
    hit: () => {
        countapi.hit(countApiHandler.consts.namespace, countApiHandler.consts.key);
    },
    get: () => {
        return countapi.get(countApiHandler.consts.namespace, countApiHandler.consts.key);
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

window.__cutTheCutlery__ = {
    countApi: countApiHandler,
    elementRenderListener,
    locationPathNameListener
};