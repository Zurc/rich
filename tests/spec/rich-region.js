define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var backbone = require('backbone');
var utils = require('rich/utils');
var Modifier = require('famous/core/Modifier');
var Engine = require('famous/core/Engine');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var css = require('tests/utils/css');
var colors = require('tests/utils/colors').blue;
var log = require('tests/utils/log');
var Setup = require('tests/utils/setup').Setup;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Region:', function() {


    beforeEach(function() {
        loadFixtures('famous.html');
    });

    afterEach(function() {

    });


    it('view inherits size', function(done){
        var context = new Setup(done);
        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        box0.onShow = function(){
            var size = css.getSize(box0.$el);
            expect(size).toEqual([1000, 800]);
            context.done();
        };

        // by default, regions have their
        // 'currentView' constaints set
        // to match xit's superview.
        context.region.show(box0);
    });

    it('uses constraints', function(done){
        var context = new Setup(done);
        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        context.region.constraints = function(){
            return [
                {
                    item: box0,
                    attribute: 'width',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'width',
                },

                {
                    item: box0,
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 100
                }
            ];
        };

        box0.onShow = function(){
            var size = css.getSize(box0.$el);
            expect(size).toEqual([1000, 100]);
            context.done();
        };

        context.region.show(box0);
    });

    it('uses constraints after initial render', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        context.root.constraints = function(){
            return [
                {
                    item: region,
                    attribute: 'width',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'width'
                },

                {
                    item: region,
                    attribute: 'top',
                    relatedBy: '==',
                    toItem: root,
                    toAttribute: 'top',
                    constant: 100
                },

                {
                    item: region,
                    attribute: 'height',
                    relatedBy: '==',
                    toItem: context.root,
                    toAttribute: 'height',
                    constant: -100,
                },
            ];
        };


        box0.onShow = function(){
            expect(region._autolayout.width.value).toEqual(1000);
            expect(region._autolayout.height.value).toEqual(700);
            expect(region._autolayout.top.value).toEqual(100);
            context.done();
        };

        render().then(function(){
            expect(region._autolayout.width.value).toEqual(1000);
            expect(region._autolayout.height.value).toEqual(700);
            expect(region._autolayout.top.value).toEqual(100);

            region.show(box0);
        });
    });

    it('swaps views', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });


        var color1 = new Rectangle({
            color: 'red'
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        region.constraints = function(){
            return [
                {
                    item: 'currentView',
                    attribute: 'width',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'width'
                },

                {
                    item: 'currentView',
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 100
                }
            ];
        };

        render().then(function(){
            var size = css.getSize(box0.$el);
            expect(size).toEqual([1000, 100]);
            region.show(box1);

            render().then(function(){
                var size = css.getSize(box1.$el);
                expect(size).toEqual([1000, 100]);
                context.done();
            });
        });

        region.show(box0);
    });


}); // eof describe
}); // eof define
