import { TileScreen } from '../index.js';

export class UIManager {
    static instance;
    constructor() {
        if (UIManager.instance) {
            return UIManager.instance;
        }

        UIManager.instance = this;
        this.Initialize();
    }
    
    static Instance() {
        if (!UIManager.instance) {
            UIManager.instance = new UIManager();
        } 
        return UIManager.instance;
    }

    Initialize() {
        this.panels = {};  // UI 패널들을 저장할 객체

        this.registerPanel("TileScreen", new TileScreen());
    }

    // UI 패널을 등록하는 메서드
    registerPanel(panelName, panelInstance) {
        this.panels[panelName] = panelInstance;
    }

    // 특정 UI 패널을 열 때 호출하는 메서드
    openPanel(panelName) {
        if (this.panels[panelName]) {
            this.panels[panelName].open();
        }
    }

    // 특정 UI 패널을 닫을 때 호출하는 메서드
    closePanel(panelName) {
        if (this.panels[panelName]) {
            this.panels[panelName].close();
        }
    }
}

export class Panel {
    constructor(elementId) {
        //this.element = document.getElementById(elementId);
    }

    open() {
        this.element.style.display = "block";
    }

    close() {
        this.element.style.display = "none";
    }
}