 'use strict';
import plantAnimation from './modules/plantAnimation';
import nonCachedStyleAppender from './modules/nonCachedStyleAppender';

nonCachedStyleAppender.append('popup.css');
plantAnimation.start();