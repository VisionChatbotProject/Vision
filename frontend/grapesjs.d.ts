declare module 'grapesjs-custom-code';
declare module 'grapesjs-lory-slider';
declare module 'grapesjs-parser-postcss';
declare module 'grapesjs-style-bg';
declare module 'grapesjs-tabs';
declare module 'grapesjs-tooltip';
declare module 'grapesjs-touch';
declare module 'grapesjs-tui-image-editor';
declare module 'grapesjs-typed';

declare module 'grapesjs' {
    export const version: string;

    export function init(config: EditorConfig): Editor;

    export type CommandFunctionOptions = () => void;

    export interface CommandHandlerOptions {
        run: (editor: Editor) => void;
        stop: (editor: Editor) => void;
    }

    export interface PanelConfig {
        id: string;
        el: string;
        buttons?: ButtonOptions[];
    }

    export interface ButtonOptions {
        id: string;
        label?: string;
        className: string;
        command: string | ((editor: Editor) => void);
        attributes?: Record<string, unknown>;
        active?: boolean;
        context?: string;
    }

    export interface EditorModal {
        setTitle(title: string): EditorModal;
        setContent(content?: HTMLElement | string | null): EditorModal;
        open(): void;
        getModel(): import('events').EventEmitter;
    }

    export interface Editor {
        [x: string]: any;
        StorageManager: {
            add(id: string, options: Record<string, unknown>): void;
        };

        BlockManager: {
          add(id: string, options: BlockManagerBlockConfig): void;
        };
        I18n: {
            addMessages(lang: Record<string, unknown>): void;
        };
        Panels: {
            addButton(id: string, options: ButtonOptions): void;
            getButton(panelId: string, buttonId: string): unknown;
            addPanel(config: PanelConfig): unknown;
        };
        Modal: EditorModal;
        Commands: {
            add(id: string, options: CommandFunctionOptions | CommandHandlerOptions): void;
        };
        DomComponents: {
            clear(): unknown[];
            addType(typeId: string, typeOptions: ComponentTypeConfig): unknown;
        };
        getComponents: () => unknown[];
        getHtml(): string;
        getCss(): string;
        setDevice(device: string): void;
        setComponents(component: string): void;
        runCommand(commandId: string): void;
        on(eventName: string, callback: (event?: Event) => void): void;
        store(): void;
    }

    export interface BlockManagerBlockConfig {
      label: string;
      attributes?: Record<string, string>;
      content: string | Component | Component[];
      media?: string; // HTML string for the media/icon of the block, eg. <svg ..., <img ..., etc.
      category?: string // Block category, eg. Basic blocks
      select?: boolean;
      disable?: boolean; // Disable the block from being interacted
      resetId?: boolean; // If true, all IDs of dropped components and their styles will be changed.
      activate?: boolean;
      onClick?: Function; // Custom behavior on click, eg. (block, editor) => editor.getWrapper().append(block.get('content'))
    }
    export interface BlockConfig extends BlockManagerBlockConfig{
      id: string;
    }

    export type ComponentModelDefaults = ComponentDefinitionOptions & Record<string, unknown>;
    export interface ComponentTypeConfig {
      isComponent?: (el: unknown) => boolean | Component;
      model?: {
        defaults: ComponentModelDefaults;
        init?: Function;
        updated?: Function;
        removed?: Function;
        [key: string]: Function | ComponentModelDefaults | undefined;
      };
      view?: {
        events?: Record<string, string>;
        init?: Function;
        onRender?: Function;
        innerElClick?: Function;
        removed?: Function;
        [key: string]: Function | Record<string, string> | undefined;
      };
    }

      export interface ComponentDefinitionOptions {
    tagName?: string; // HTML tag of the component, eg. span. Default: div
    attributes?: Object; // Key-value object of the component's attributes, eg. { title: 'Hello' } Default: {}
    name?: string; // Name of the component. Will be used, for example, in Layers and badges
    removable?: boolean; // When true the component is removable from the canvas, default: true
    draggable?: boolean | string | string[] | Function; // Indicates if it's possible to drag the component inside others. You can also specify a query string to indentify elements, eg. '.some-class[title=Hello], [data-gjs-type=column]' means you can drag the component only inside elements containing some-class class and Hello title, and column components. In the case of a function, target and destination components are passed as arguments, return a boolean to indicate if the drag is possible. Default: true
    droppable?: boolean | string | string[] | Function; // Indicates if it's possible to drop other components inside. You can use a query string as with draggable. In the case of a function, target and destination components are passed as arguments, return a boolean to indicate if the drop is possible. Default: true
    badgable?: boolean; // Set to false if you don't want to see the badge (with the name) over the component. Default: true
    stylable?: boolean | string[]; // True if it's possible to style the component. You can also indicate an array of CSS properties which is possible to style, eg. ['color', 'width'], all other properties will be hidden from the style manager. Default: true
    'stylable-require'?: string[]; // Indicate an array of style properties to show up which has been marked as toRequire. Default: []
    unstylable?: string[]; // Indicate an array of style properties which should be hidden from the style manager. Default: []
    highlightable?: boolean; // It can be highlighted with 'dotted' borders if true. Default: true
    copyable?: boolean; // True if it's possible to clone the component. Default: true
    resizable?: boolean; // Indicates if it's possible to resize the component. It's also possible to pass an object as options for the Resizer (opens new window). Default: false
    editable?: boolean; // Allow to edit the content of the component (used on Text components). Default: false
    layerable?: boolean; // Set to false if you need to hide the component inside Layers. Default: true
    selectable?: boolean; // Allow component to be selected when clicked. Default: true
    hoverable?: boolean; // Shows a highlight outline when hovering on the element if true. Default: true
    void?: boolean; // This property is used by the HTML exporter as void elements don't have closing tags, eg. <br/>, <hr/>, etc. Default: false
    styles?: string; // Component related styles, eg. .my-component-class { color: red }
    style?: Object; // Component styles, eg. {width: '100%', height: '100%'}
    content?: string; // Content of the component (not escaped) which will be appended before children rendering. Default: ''
    icon?: string; // Component's icon, this string will be inserted before the name (in Layers and badge), eg. it can be an HTML string ''. Default: ''
    script?: string | Function; // Component's javascript. More about it here. Default: ''
    'script-export'?: string | Function; // You can specify javascript available only in export functions (eg. when you get the HTML). If this property is defined it will overwrite the script one (in export functions). Default: ''
    traits?: Object[] | string[]; // Component's traits. More about it here. Default: ['id', 'title']
    propagate?: string[]; // Indicates an array of properties which will be inhereted by all NEW appended children. For example if you create a component likes this: { removable: false, draggable: false, propagate: ['removable', 'draggable'] } and append some new component inside, the new added component will get the exact same properties indicated in the propagate array (and the propagate property itself). Default: []
    toolbar?: Object[]; // Set an array of items to show up inside the toolbar when the component is selected (move, clone, delete). Eg. toolbar: [ { attributes: {class: 'fa fa-arrows'}, command: 'tlb-move' }, ... ]. By default, when toolbar property is falsy the editor will add automatically commands like move, delete, etc. based on its properties.
    components?: Component[] | string; // Children components. Default: null
  }

    export interface BlockManagerConfig {
        appendTo: string;
        blocks: BlockConfig[];
    }

    export type EditorDragMode = 'absolute' | 'translate';

    export interface EditorConfig {
        /**
         * The html target element.
         */
        container?: string;

        plugins?: unknown[];
        pluginsOpts?: { [p: string]: unknown };
        autorender?: boolean;
        // Style prefix
        stylePrefix?: string;

        // HTML string or object of components
        components?: string;

        // CSS string or object of rules
        style?: string;

        // If true, will fetch HTML and CSS from selected container
        fromElement?: boolean;

        // Show an alert before unload the page with unsaved changes
        noticeOnUnload?: boolean;

        // Show paddings and margins
        showOffsets?: boolean;

        // Show paddings and margins on selected component
        showOffsetsSelected?: boolean;

        // On creation of a new Component (via object), if the 'style' attribute is not
        // empty, all those roles will be moved in its new class
        forceClass?: boolean;

        // Height for the editor container
        height?: string;

        // Width for the editor container
        width?: string;

        // Type of logs to print with the logger (by default is used the devtool console).
        // Available by default: debug, info, warning, error
        // You can use `false` to disable all of them or `true` to print all of them
        log?: string[];

        // By default Grapes injects base CSS into the canvas. For example, it sets body margin to 0
        // and sets a default background color of white. This CSS is desired in most cases.
        // use this property if you wish to overwrite the base CSS to your own CSS. This is most
        // useful if for example your template is not based off a document with 0 as body margin.
        baseCss?: string;

        // CSS that could only be seen (for instance, inside the code viewer)
        protectedCss?: string;

        // CSS for the iframe which containing the canvas, useful if you need to custom something inside
        // (eg. the style of the selected component)
        canvasCss?: string;

        // Default command
        defaultCommand?: string;

        // Show a toolbar when the component is selected
        showToolbar?: boolean;

        // Allow script tag importing
        allowScripts?: boolean;

        // If true render a select of available devices
        showDevices?: boolean;

        // When enabled, on device change media rules won't be created
        devicePreviewMode?: boolean;

        // THe condition to use for media queries, eg. 'max-width'
        // Comes handy for mobile-first cases
        mediaCondition?: string;

        // Starting tag for variable inside scripts in Components
        tagVarStart?: string;

        // Ending tag for variable inside scripts in Components
        tagVarEnd?: string;

        // When false, removes empty text nodes when parsed, unless they contain a space
        keepEmptyTextNodes?: boolean;

        // Return JS of components inside HTML from 'editor.getHtml()'
        jsInHtml?: boolean;

        // Enable native HTML5 drag and drop
        nativeDnD?: boolean;

        // Enable multiple selection
        multipleSelection?: boolean;

        // Show the wrapper component in the final code, eg. in editor.getHtml()
        exportWrapper?: boolean;

        // The wrapper, if visible, will be shown as a `<body>`
        wrappesIsBody?: boolean;

        // Usually when you update the `style` of the component this changes the
        // element's `style` attribute. Unfortunately, inline styling doesn't allow
        // use of media queries (@media) or even pseudo selectors (eg. :hover).
        // When `avoidInlineStyle` is true all styles are inserted inside the css rule
        avoidInlineStyle?: boolean;

        // Avoid default properties from storable JSON data, like `components` and `styles`.
        // With this option enabled your data will be smaller (usefull if need to
        // save some storage space)
        avoidDefaults?: boolean;

        // (experimental)
        // The structure of components is always on the screen but it's not the same
        // for style rules. When you delete a component you might leave a lot of styles
        // which will never be used again, therefore they might be removed.
        // With this option set to true, styles not used from the CSS generator (so in
        // any case where `CssGenerator.build` is used) will be removed automatically.
        // But be careful, not always leaving the style not used mean you wouldn't
        // use it later, but this option comes really handy when deal with big templates.
        clearStyles?: boolean;

        // Specify the global drag mode of components. By default, components are moved
        // following the HTML flow. Two other options are available:
        // 'absolute' - Move components absolutely (design tools way)
        // 'translate' - Use translate CSS from transform property
        // To get more about this feature read: https://github.com/artf/grapesjs/issues/1936
        dragMode?: EditorDragMode;

        // Dom element
        el?: Element | string;

        // Configurations for Undo Manager
        // TODO: convert configs to ts
        undoManager?: unknown;

        // Configurations for Asset Manager
        assetManager?: unknown;

        // Configurations for Canvas
        canvas?: unknown;

        // Configurations for Layers
        layers?: unknown;

        // Configurations for Storage Manager
        storageManager?: unknown;

        // Configurations for Rich Text Editor
        rte?: unknown;

        // Configurations for DomComponents
        domComponents?: unknown;

        // Configurations for Modal Dialog
        modal?: unknown;

        // Configurations for Code Manager
        codeManager?: unknown;

        // Configurations for Panels
        panels?: unknown;

        // Configurations for Commands
        commands?: unknown;

        // Configurations for Css Composer
        cssComposer?: unknown;

        // Configurations for Selector Manager
        selectorManager?: unknown;

        // Configurations for Device Manager
        deviceManager?: unknown;

        // Configurations for Style Manager
        styleManager?: unknown;

        // Configurations for Block Manager
        blockManager?: BlockManagerConfig;

        // Configurations for Trait Manager
        traitManager?: unknown;

        // Texts
        textViewCode?: string;

        // Keep unused styles within the editor
        keepUnusedStyles?: boolean;

        // TODO
        multiFrames?: boolean;
    }

  export type PluginsOptions = { [pluginName: string]: { [optionName: string]: unknown } }; 

  export interface ComponentDefinitionOptions {
    tagName?: string; // HTML tag of the component, eg. span. Default: div
    attributes?: Object; // Key-value object of the component's attributes, eg. { title: 'Hello' } Default: {}
    name?: string; // Name of the component. Will be used, for example, in Layers and badges
    removable?: boolean; // When true the component is removable from the canvas, default: true
    draggable?: boolean | string | string[] | Function; // Indicates if it's possible to drag the component inside others. You can also specify a query string to indentify elements, eg. '.some-class[title=Hello], [data-gjs-type=column]' means you can drag the component only inside elements containing some-class class and Hello title, and column components. In the case of a function, target and destination components are passed as arguments, return a boolean to indicate if the drag is possible. Default: true
    droppable?: boolean | string | string[] | Function; // Indicates if it's possible to drop other components inside. You can use a query string as with draggable. In the case of a function, target and destination components are passed as arguments, return a boolean to indicate if the drop is possible. Default: true
    badgable?: boolean; // Set to false if you don't want to see the badge (with the name) over the component. Default: true
    stylable?: boolean | string[]; // True if it's possible to style the component. You can also indicate an array of CSS properties which is possible to style, eg. ['color', 'width'], all other properties will be hidden from the style manager. Default: true
    'stylable-require'?: string[]; // Indicate an array of style properties to show up which has been marked as toRequire. Default: []
    unstylable?: string[]; // Indicate an array of style properties which should be hidden from the style manager. Default: []
    highlightable?: boolean; // It can be highlighted with 'dotted' borders if true. Default: true
    copyable?: boolean; // True if it's possible to clone the component. Default: true
    resizable?: boolean; // Indicates if it's possible to resize the component. It's also possible to pass an object as options for the Resizer (opens new window). Default: false
    editable?: boolean; // Allow to edit the content of the component (used on Text components). Default: false
    layerable?: boolean; // Set to false if you need to hide the component inside Layers. Default: true
    selectable?: boolean; // Allow component to be selected when clicked. Default: true
    hoverable?: boolean; // Shows a highlight outline when hovering on the element if true. Default: true
    void?: boolean; // This property is used by the HTML exporter as void elements don't have closing tags, eg. <br/>, <hr/>, etc. Default: false
    styles?: string; // Component related styles, eg. .my-component-class { color: red }
    style?: Object; // Component styles, eg. {width: '100%', height: '100%'}
    content?: string; // Content of the component (not escaped) which will be appended before children rendering. Default: ''
    icon?: string; // Component's icon, this string will be inserted before the name (in Layers and badge), eg. it can be an HTML string ''. Default: ''
    script?: string | Function; // Component's javascript. More about it here. Default: ''
    'script-export'?: string | Function; // You can specify javascript available only in export functions (eg. when you get the HTML). If this property is defined it will overwrite the script one (in export functions). Default: ''
    traits?: Object[] | string[]; // Component's traits. More about it here. Default: ['id', 'title']
    propagate?: string[]; // Indicates an array of properties which will be inhereted by all NEW appended children. For example if you create a component likes this: { removable: false, draggable: false, propagate: ['removable', 'draggable'] } and append some new component inside, the new added component will get the exact same properties indicated in the propagate array (and the propagate property itself). Default: []
    toolbar?: Object[]; // Set an array of items to show up inside the toolbar when the component is selected (move, clone, delete). Eg. toolbar: [ { attributes: {class: 'fa fa-arrows'}, command: 'tlb-move' }, ... ]. By default, when toolbar property is falsy the editor will add automatically commands like move, delete, etc. based on its properties.
    components?: Component[] | string; // Children components. Default: null
  }

  export interface Component extends ComponentDefinitionOptions{
    type: string; // Component type, eg. text, image, video, etc.
  }
}
