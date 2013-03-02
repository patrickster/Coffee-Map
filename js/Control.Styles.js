
/*
 * L.Control.styles is a control that allows users to set the style
 * of a particular FeatureGroup. 
 *
 * Uses the code for the L.Control.Layers class as a blueprint:
 * https://github.com/Leaflet/Leaflet/blob/master/src/control/Control.Layers.js
 */

L.Control.Styles = L.Control.extend({

    options: {
        position: 'topright',
        title: '',
        autoZIndex: true
    },

    initialize: function (featureGroup, styles, options, initialStyle) {
        L.setOptions(this, options);
        this._featureGroup = featureGroup;
        this._currentStyle = initialStyle;
        this._styles = {};
        for (var i in styles) {
            if (styles.hasOwnProperty(i)) {
                this._addstyle(styles[i], i);
            }
        }
    },

    onAdd: function (map) {
        this._initLayout();
        this._update();
        return this._container;
    },

    getCurrentStyle: function () {
        console.log(this._currentStyle);
        return this._currentStyle;
    },

    _initLayout: function () {
        var className = 'leaflet-control-styles',
            container = this._container = L.DomUtil.create('div', className);

        var form = this._form = L.DomUtil.create('form', className + '-list');
        
        this._stylesList = L.DomUtil.create('div', className + '-base', form);
        var title = L.DomUtil.create('div', 'leaflet-control-styles-title', this._stylesList);
        title.innerHTML = this.options.title;

        container.appendChild(form);
    },

    _addstyle: function (fun, name) {
        var id = L.stamp(fun);
        this._styles[id] = {
            id: id,
            name: name,
            fun: fun
        };
    },

    _update: function () {
        if (!this._container) {
            return;
        }

        // this._stylesList.innerHTML = '<span><b>this.options.title</b></span>;

        for (var i in this._styles) {
            if (this._styles.hasOwnProperty(i)) {
                var obj = this._styles[i];
                this._addItem(obj);
            }
        }

        // this._separator.style.display = 'none';
    },

    // _onLayerChange: function (e) {
    //     var id = L.stamp(e.layer);
    //     if (this._layers[id] && !this._handlingClick) {
    //         this._update();
    //     }
    // },

    _createRadioElement: function (name, checked) {

        var radioHtml = '<input type="radio" class="leaflet-control-styles-selector"'
                      + 'name="' + name + '"';

        if (checked) {
            radioHtml += ' checked="checked"';
        }
        radioHtml += '/>';

        var radioFragment = document.createElement('div');
        radioFragment.innerHTML = radioHtml;

        return radioFragment.firstChild;
    },

    _addItem: function (obj) {
        
        var label = document.createElement('label'),
            checked = false,
            input;

        if (this._currentStyle == obj.name) checked = true;

        input = this._createRadioElement(obj.name, checked);
        input.id = obj.id;

        L.DomEvent.on(input, 'click', this._onInputClick, this);

        var name = document.createElement('span');
        name.innerHTML = ' ' + obj.name;

        label.appendChild(input);
        label.appendChild(name);

        var container = this._stylesList;
        container.appendChild(label);

        return label;
    },

    _onInputClick: function (e) {

        var input, obj,
            targetId = e.target.id,
            inputs = this._form.getElementsByTagName('input'),
            inputsLen = inputs.length;

        // this._handlingClick = true;
        
        for (var i = 0; i < inputsLen; i++) {
            input = inputs[i];
            if (input.id == targetId) {
                input.checked = true;
                obj = this._styles[input.id];
                this._currentStyle = obj.name;
                console.log(this._currentStyle);
                this._featureGroup.setStyle(obj.fun);
                
            } else {
                if (input.checked) {
                    input.checked = false;
                }
            }
        }
    },


});

L.control.styles = function (featureGroup, styles, options, initialStyle) {
    return new L.Control.Styles(featureGroup, styles, options, initialStyle);
};
