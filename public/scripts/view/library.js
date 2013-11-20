define([
    'jquery',
    'lodash',
    'util/events',
    'view/library-infowindow',
    'view/marker',
    'text!../../templates/library.html'
], function ($, _, events, infoWindow, Marker, template) {
    'use strict';

    var Library = function (options) {
        this.$el = $('<div>');
        this.$el.attr(this.attributes);
        this.model = options.model;
        this.initialize();
    };
    _.extend(Library.prototype, {
        attributes: {
            class: 'list-group-item js-library library'
        },
        template: _.template(template),

        initialize: function () {
            _.bindAll(this);
            this.initializeMarker();
            this.bindEvents();
        },

        initializeMarker: function () {
            var model = this.model;
            var coords = model.get('latlng').split(',');
            var lat = coords[0];
            var lng = coords[1];
            this.marker = new Marker(lat, lng, model.get('name'));
            this.marker.drop();
        },

        bindEvents: function () {
            this.model.on('change:active', this.onActiveChange);
            this.model.on('change:visible', this.onVisibleChange);
            this.$el.on('click', '.js-btn-activate', this.onActivateClick);
            this.$el.on('mouseenter', this.onMouseEnter);
            this.$el.on('mouseleave', this.onMouseLeave);
            this.marker.on('click', this.onMarkerClick);
        },

        onActiveChange: function (model, active) {
            this.$el.toggleClass('active', active);
            this.marker.stopBounce();
        },

        onVisibleChange: function (model, visible) {
            if (visible) {
                this.show();
            } else {
                this.hide();
                if (this.model.get('active')) {
                    this.model.set('active', false);
                    infoWindow.close();
                }
            }
        },

        onActivateClick: function (event) {
            event.preventDefault();
            infoWindow.open(this.model);
            this.model.set('active', true);
        },

        onMouseEnter: function () {
            this.marker.startBounce();
        },

        onMouseLeave: function () {
            this.marker.stopBounce();
        },

        onMarkerClick: function () {
            infoWindow.open(this.model);
            this.model.set('active', true);
        },

        hide: function () {
            this.marker.hide();
            this.$el.hide();
        },

        show: function () {
            this.marker.show();
            this.$el.show();
        },

        render: function () {
            var templateData = this.model.toJSON();
            this.$el.html(this.template(templateData));
            return this;
        }
    }, events);

    return Library;
});
