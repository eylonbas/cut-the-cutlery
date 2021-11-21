const append = (href) => {
    const styleLinkElement = document.createElement('link');
    styleLinkElement.rel = 'stylesheet';
    styleLinkElement.href = `${href}?${new Date().getTime()}`;
    document.body.appendChild(styleLinkElement);
}

export default { append };