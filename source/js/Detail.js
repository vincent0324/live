class Detail {

    constructor() {
        this.init();
    }

    init() {
        this.bindEvent();
    }

    bindEvent() {
        let tabButton = document.getElementById('live-detail-button');
        let tabContent = document.getElementById('live-detail-text');
        let tabButtonIcon = tabButton.getElementsByTagName('i')[0];

        tabButton.addEventListener('click', function() {
            if (tabButton.className === 'live-detail-button') {
                tabButton.className = 'live-detail-button on';
                tabContent.className = 'live-detail-text';
                tabButtonIcon.innerHTML = '&#xe605;';
            } else {
                tabButton.className = 'live-detail-button';
                tabContent.className = 'live-detail-text fn-hide';
                tabButtonIcon.innerHTML = '&#xe606;';
            }
        }, false);
    }
};

export default Detail;
