// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
// 
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require bootstrap
//= require moment
//= require bootstrap-datetimepicker
//= require_tree .



















(function ($, window, document, undefined) {
  var pluginName = 'bootstrapDualListbox',
    defaults = {
      bootstrap2Compatible: false,
      filterTextClear: 'show all',
      filterPlaceHolder: 'Filter',
      moveSelectedLabel: 'Move selected',
      moveAllLabel: 'Move all',
      removeSelectedLabel: 'Remove selected',
      removeAllLabel: 'Remove all',
      moveOnSelect: true,                                                                 
      preserveSelectionOnMove: false,                                                     
      selectedListLabel: false,                                                           
      nonSelectedListLabel: false,                                                        
      selectOrMinimalHeight: 100,
      showFilterInputs: true,                                                            
      nonSelectedFilter: '',                                                              
      selectedFilter: '',                                                                 
      infoText: 'Showing all {0}',                                                        
      filterOnValues: false                                                              
    },

    isBuggyAndroid = /android/i.test(navigator.userAgent.toLowerCase());

  function BootstrapDualListbox(element, options) {
    this.element = $(element);

    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  function triggerChangeEvent(dualListbox) {
    dualListbox.element.trigger('change');
  }

  function updateSelectionStates(dualListbox) {
    dualListbox.element.find('option').each(function(index, item) {
      var $item = $(item);
      if (typeof($item.data('original-index')) === 'undefined') {
        $item.data('original-index', dualListbox.elementCount++);
      }
      if (typeof($item.data('_selected')) === 'undefined') {
        $item.data('_selected', false);
      }
    });
  }

  function changeSelectionState(dualListbox, original_index, selected) {
    dualListbox.element.find('option').each(function(index, item) {
      var $item = $(item);
      if ($item.data('original-index') === original_index) {
        $item.prop('selected', selected);
      }
    });
  }

  function formatString(s, args) {
    return s.replace(/\{(\d+)\}/g, function(match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  }

  function refreshInfo(dualListbox) {
    if (!dualListbox.settings.infoText) {
      return;
    }

    var visible1 = dualListbox.elements.select1.find('option').length,
      visible2 = dualListbox.elements.select2.find('option').length,
      all1 = dualListbox.element.find('option').length - dualListbox.selectedElements,
      all2 = dualListbox.selectedElements,
      content = '';

    if (all1 === 0) {
      content = dualListbox.settings.infoTextEmpty;
    } else if (visible1 === all1) {
      content = formatString(dualListbox.settings.infoText, [visible1, all1]);
    } else {
      content = formatString(dualListbox.settings.infoTextFiltered, [visible1, all1]);
    }

    dualListbox.elements.info1.html(content);
    dualListbox.elements.box1.toggleClass('filtered', !(visible1 === all1 || all1 === 0));

    if (all2 === 0) {
      content = dualListbox.settings.infoTextEmpty;
    } else if (visible2 === all2) {
      content = formatString(dualListbox.settings.infoText, [visible2, all2]);
    } else {
      content = formatString(dualListbox.settings.infoTextFiltered, [visible2, all2]);
    }

    dualListbox.elements.info2.html(content);
    dualListbox.elements.box2.toggleClass('filtered', !(visible2 === all2 || all2 === 0));
  }

  function refreshSelects(dualListbox) {
    dualListbox.selectedElements = 0;

    dualListbox.elements.select1.empty();
    dualListbox.elements.select2.empty();

    dualListbox.element.find('option').each(function(index, item) {
      var $item = $(item);
      if ($item.prop('selected')) {
        dualListbox.selectedElements++;
        dualListbox.elements.select2.append($item.clone(true).prop('selected', $item.data('_selected')));
      } else {
        dualListbox.elements.select1.append($item.clone(true).prop('selected', $item.data('_selected')));
      }
    });

    if (dualListbox.settings.showFilterInputs) {
      filter(dualListbox, 1);
      filter(dualListbox, 2);
    }
    refreshInfo(dualListbox);
  }

  function filter(dualListbox, selectIndex) {
    if (!dualListbox.settings.showFilterInputs) {
      return;
    }

    saveSelections(dualListbox, selectIndex);

    dualListbox.elements['select'+selectIndex].empty().scrollTop(0);
    var regex = new RegExp($.trim(dualListbox.elements['filterInput'+selectIndex].val()), 'gi'),
      options = dualListbox.element;

    if (selectIndex === 1) {
      options = options.find('option').not(':selected');
    } else  {
      options = options.find('option:selected');
    }

    options.each(function(index, item) {
      var $item = $(item),
        isFiltered = true;
      if (item.text.match(regex) || (dualListbox.settings.filterOnValues && $item.attr('value').match(regex) ) ) {
        isFiltered = false;
        dualListbox.elements['select'+selectIndex].append($item.clone(true).prop('selected', $item.data('_selected')));
      }
      dualListbox.element.find('option').eq($item.data('original-index')).data('filtered'+selectIndex, isFiltered);
    });

    refreshInfo(dualListbox);
  }

  function saveSelections(dualListbox, selectIndex) {
    dualListbox.elements['select'+selectIndex].find('option').each(function(index, item) {
      var $item = $(item);
      dualListbox.element.find('option').eq($item.data('original-index')).data('_selected', $item.prop('selected'));
    });
  }

  function sortOptions(select) {
    select.find('option').sort(function(a, b) {
      return ($(a).data('original-index') > $(b).data('original-index')) ? 1 : -1;
    }).appendTo(select);
  }

  function clearSelections(dualListbox) {
    dualListbox.elements.select1.find('option').each(function() {
      dualListbox.element.find('option').data('_selected', false);
    });
  }

  function move(dualListbox) {
    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
    }

    dualListbox.elements.select1.find('option:selected').each(function(index, item) {
      var $item = $(item);
      //
      if (!$item.data('filtered1')) {
        changeSelectionState(dualListbox, $item.data('original-index'), true);
      }
    });

    refreshSelects(dualListbox);
    triggerChangeEvent(dualListbox);
    sortOptions(dualListbox.elements.select2);
  }

  function remove(dualListbox) {
    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 2);
    }

    dualListbox.elements.select2.find('option:selected').each(function(index, item) {
      var $item = $(item);
      if (!$item.data('filtered2')) {
        changeSelectionState(dualListbox, $item.data('original-index'), false);
      }
    });

    refreshSelects(dualListbox);
    triggerChangeEvent(dualListbox);
    sortOptions(dualListbox.elements.select1);
  }

  function moveAll(dualListbox) {
    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
    }

    dualListbox.element.find('option').each(function(index, item) {
      var $item = $(item);
      if (!$item.data('filtered1')) {
        $item.prop('selected', true);
      }
    });

    refreshSelects(dualListbox);
    triggerChangeEvent(dualListbox);
  }

  function removeAll(dualListbox) {
    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 2);
    }

    dualListbox.element.find('option').each(function(index, item) {
      var $item = $(item);
      if (!$item.data('filtered2')) {
        $item.prop('selected', false);
      }
    });

    refreshSelects(dualListbox);
    triggerChangeEvent(dualListbox);
  }

  function bindEvents(dualListbox) {
    dualListbox.elements.form.submit(function(e) {
      if (dualListbox.elements.filterInput1.is(':focus')) {
        e.preventDefault();
        dualListbox.elements.filterInput1.focusout();
      } else if (dualListbox.elements.filterInput2.is(':focus')) {
        e.preventDefault();
        dualListbox.elements.filterInput2.focusout();
      }
    });

    dualListbox.element.on('bootstrapDualListbox.refresh', function(e, mustClearSelections){
      dualListbox.refresh(mustClearSelections);
    });

    dualListbox.elements.filterClear1.on('click', function() {
      dualListbox.setNonSelectedFilter('', true);
    });

    dualListbox.elements.filterClear2.on('click', function() {
      dualListbox.setSelectedFilter('', true);
    });

    dualListbox.elements.moveButton.on('click', function() {
      move(dualListbox);
    });

    dualListbox.elements.moveAllButton.on('click', function() {
      moveAll(dualListbox);
    });

    dualListbox.elements.removeButton.on('click', function() {
      remove(dualListbox);
    });

    dualListbox.elements.removeAllButton.on('click', function() {
      removeAll(dualListbox);
    });

    dualListbox.elements.filterInput1.on('change keyup', function() {
      filter(dualListbox, 1);
    });

    dualListbox.elements.filterInput2.on('change keyup', function() {
      filter(dualListbox, 2);
    });
  }

  BootstrapDualListbox.prototype = {
    init: function () {
      // Add the custom HTML template
      this.container = $('' +
        '<div class="bootstrap-duallistbox-container">' +
        ' <div class="box1">' +
        '   <label></label>' +
        '   <span class="info-container">' +
        '     <span class="info"></span>' +
        '     <button type="button" class="btn clear1 pull-right"></button>' +
        '   </span>' +
        '   <input class="filter" type="text">' +
        '   <div class="btn-group buttons">' +
        '     <button type="button" class="btn moveall">' +
        '       <i></i>' +
        '       <i></i>' +
        '     </button>' +
        '     <button type="button" class="btn move">' +
        '       <i></i>' +
        '     </button>' +
        '   </div>' +
        '   <select multiple="multiple"></select>' +
        ' </div>' +
        ' <div class="box2">' +
        '   <label></label>' +
        '   <span class="info-container">' +
        '     <span class="info"></span>' +
        '     <button type="button" class="btn clear2 pull-right"></button>' +
        '   </span>' +
        '   <input class="filter" type="text">' +
        '   <div class="btn-group buttons">' +
        '     <button type="button" class="btn remove">' +
        '       <i></i>' +
        '     </button>' +
        '     <button type="button" class="btn removeall">' +
        '       <i></i>' +
        '       <i></i>' +
        '     </button>' +
        '   </div>' +
        '   <select multiple="multiple"></select>' +
        ' </div>' +
        '</div>')
        .insertBefore(this.element);

      this.elements = {
        originalSelect: this.element,
        box1: $('.box1', this.container),
        box2: $('.box2', this.container),
        filterInput1: $('.box1 .filter', this.container),
        filterInput2: $('.box2 .filter', this.container),
        filterClear1: $('.box1 .clear1', this.container),
        filterClear2: $('.box2 .clear2', this.container),
        label1: $('.box1 > label', this.container),
        label2: $('.box2 > label', this.container),
        info1: $('.box1 .info', this.container),
        info2: $('.box2 .info', this.container),
        select1: $('.box1 select', this.container),
        select2: $('.box2 select', this.container),
        moveButton: $('.box1 .move', this.container),
        removeButton: $('.box2 .remove', this.container),
        moveAllButton: $('.box1 .moveall', this.container),
        removeAllButton: $('.box2 .removeall', this.container),
        form: $($('.box1 .filter', this.container)[0].form)
      };

      this.originalSelectName = this.element.attr('name') || '';
      var select1Id = 'bootstrap-duallistbox-nonselected-list_' + this.originalSelectName,
        select2Id = 'bootstrap-duallistbox-selected-list_' + this.originalSelectName;
      this.elements.select1.attr('id', select1Id);
      this.elements.select2.attr('id', select2Id);
      this.elements.label1.attr('for', select1Id);
      this.elements.label2.attr('for', select2Id);

      this.selectedElements = 0;
      this.elementCount = 0;
      this.setBootstrap2Compatible(this.settings.bootstrap2Compatible);
      this.setFilterTextClear(this.settings.filterTextClear);
      this.setFilterPlaceHolder(this.settings.filterPlaceHolder);
      this.setMoveSelectedLabel(this.settings.moveSelectedLabel);
      this.setMoveAllLabel(this.settings.moveAllLabel);
      this.setRemoveSelectedLabel(this.settings.removeSelectedLabel);
      this.setRemoveAllLabel(this.settings.removeAllLabel);
      this.setMoveOnSelect(this.settings.moveOnSelect);
      this.setPreserveSelectionOnMove(this.settings.preserveSelectionOnMove);
      this.setSelectedListLabel(this.settings.selectedListLabel);
      this.setNonSelectedListLabel(this.settings.nonSelectedListLabel);
      this.setHelperSelectNamePostfix(this.settings.helperSelectNamePostfix);
      this.setSelectOrMinimalHeight(this.settings.selectOrMinimalHeight);

      updateSelectionStates(this);

      this.setShowFilterInputs(this.settings.showFilterInputs);
      this.setNonSelectedFilter(this.settings.nonSelectedFilter);
      this.setSelectedFilter(this.settings.selectedFilter);
      this.setInfoText(this.settings.infoText);
      this.setInfoTextFiltered(this.settings.infoTextFiltered);
      this.setInfoTextEmpty(this.settings.infoTextEmpty);
      this.setFilterOnValues(this.settings.filterOnValues);

      this.element.hide();

      bindEvents(this);
      refreshSelects(this);

      return this.element;
    },
    setBootstrap2Compatible: function(value, refresh) {
      this.settings.bootstrap2Compatible = value;
      if (value) {
        this.container.removeClass('row').addClass('row-fluid bs2compatible');
        this.container.find('.box1, .box2').removeClass('col-md-6').addClass('span6');
        this.container.find('.clear1, .clear2').removeClass('btn-default btn-xs').addClass('btn-mini');
        this.container.find('input, select').removeClass('form-control');
        this.container.find('.btn').removeClass('btn-default');
        this.container.find('.moveall > i, .move > i').removeClass('glyphicon glyphicon-arrow-right').addClass('icon-arrow-right');
        this.container.find('.removeall > i, .remove > i').removeClass('glyphicon glyphicon-arrow-left').addClass('icon-arrow-left');
      } else {
        this.container.removeClass('row-fluid bs2compatible').addClass('row');
        this.container.find('.box1, .box2').removeClass('span6').addClass('col-md-6');
        this.container.find('.clear1, .clear2').removeClass('btn-mini').addClass('btn-default btn-xs');
        this.container.find('input, select').addClass('form-control');
        this.container.find('.btn').addClass('btn-default');
        this.container.find('.moveall > i, .move > i').removeClass('icon-arrow-right').addClass('glyphicon glyphicon-arrow-right');
        this.container.find('.removeall > i, .remove > i').removeClass('icon-arrow-left').addClass('glyphicon glyphicon-arrow-left');
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setFilterTextClear: function(value, refresh) {
      this.settings.filterTextClear = value;
      this.elements.filterClear1.html(value);
      this.elements.filterClear2.html(value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setFilterPlaceHolder: function(value, refresh) {
      this.settings.filterPlaceHolder = value;
      this.elements.filterInput1.attr('placeholder', value);
      this.elements.filterInput2.attr('placeholder', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setMoveSelectedLabel: function(value, refresh) {
      this.settings.moveSelectedLabel = value;
      this.elements.moveButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setMoveAllLabel: function(value, refresh) {
      this.settings.moveAllLabel = value;
      this.elements.moveAllButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setRemoveSelectedLabel: function(value, refresh) {
      this.settings.removeSelectedLabel = value;
      this.elements.removeButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setRemoveAllLabel: function(value, refresh) {
      this.settings.removeAllLabel = value;
      this.elements.removeAllButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setMoveOnSelect: function(value, refresh) {
      if (isBuggyAndroid) {
        value = true;
      }
      this.settings.moveOnSelect = value;
      if (this.settings.moveOnSelect) {
        this.container.addClass('moveonselect');
        var self = this;
        this.elements.select1.on('change', function() {
          move(self);
        });
        this.elements.select2.on('change', function() {
          remove(self);
        });
      } else {
        this.container.removeClass('moveonselect');
        this.elements.select1.off('change');
        this.elements.select2.off('change');
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setPreserveSelectionOnMove: function(value, refresh) {
      // We are forcing to move on select and disabling preserveSelectionOnMove on Android
      if (isBuggyAndroid) {
        value = false;
      }
      this.settings.preserveSelectionOnMove = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setSelectedListLabel: function(value, refresh) {
      this.settings.selectedListLabel = value;
      if (value) {
        this.elements.label2.show().html(value);
      } else {
        this.elements.label2.hide().html(value);
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setNonSelectedListLabel: function(value, refresh) {
      this.settings.nonSelectedListLabel = value;
      if (value) {
        this.elements.label1.show().html(value);
      } else {
        this.elements.label1.hide().html(value);
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setHelperSelectNamePostfix: function(value, refresh) {
      this.settings.helperSelectNamePostfix = value;
      if (value) {
        this.elements.select1.attr('name', this.originalSelectName + value + '1');
        this.elements.select2.attr('name', this.originalSelectName + value + '2');
      } else {
        this.elements.select1.removeAttr('name');
        this.elements.select2.removeAttr('name');
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setSelectOrMinimalHeight: function(value, refresh) {
      this.settings.selectOrMinimalHeight = value;
      var height = this.element.height();
      if (this.element.height() < value) {
        height = value;
      }
      this.elements.select1.height(height);
      this.elements.select2.height(height);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setShowFilterInputs: function(value, refresh) {
      if (!value) {
        this.setNonSelectedFilter('');
        this.setSelectedFilter('');
        refreshSelects(this);
        this.elements.filterInput1.hide();
        this.elements.filterInput2.hide();
      } else {
        this.elements.filterInput1.show();
        this.elements.filterInput2.show();
      }
      this.settings.showFilterInputs = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setNonSelectedFilter: function(value, refresh) {
      if (this.settings.showFilterInputs) {
        this.settings.nonSelectedFilter = value;
        this.elements.filterInput1.val(value);
        if (refresh) {
          refreshSelects(this);
        }
        return this.element;
      }
    },
    setSelectedFilter: function(value, refresh) {
      if (this.settings.showFilterInputs) {
        this.settings.selectedFilter = value;
        this.elements.filterInput2.val(value);
        if (refresh) {
          refreshSelects(this);
        }
        return this.element;
      }
    },
    setInfoText: function(value, refresh) {
      this.settings.infoText = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setInfoTextFiltered: function(value, refresh) {
      this.settings.infoTextFiltered = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setInfoTextEmpty: function(value, refresh) {
      this.settings.infoTextEmpty = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setFilterOnValues: function(value, refresh) {
      this.settings.filterOnValues = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    getContainer: function() {
      return this.container;
    },
    refresh: function(mustClearSelections) {
      updateSelectionStates(this);

      if (!mustClearSelections) {
        saveSelections(this, 1);
        saveSelections(this, 2);
      } else {
        clearSelections(this);
      }

      refreshSelects(this);
    },
    destroy: function() {
      this.container.remove();
      this.element.show();
      $.data(this, 'plugin_' + pluginName, null);
      return this.element;
    }
  };

  $.fn[ pluginName ] = function (options) {
    var args = arguments;

    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$(this).is('select')) {
          $(this).find('select').each(function(index, item) {
            $(item).bootstrapDualListbox(options);
          });
        } else if (!$.data(this, 'plugin_' + pluginName)) {

          $.data(this, 'plugin_' + pluginName, new BootstrapDualListbox(this, options));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (instance instanceof BootstrapDualListbox && typeof instance[options] === 'function') {
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }
      });

      return returns !== undefined ? returns : this;
    }

  };

})(jQuery, window, document);

! function(a, b, c, d) {
  function e(b, c) {
    this.element = a(b), this.settings = a.extend({}, v, c), this._defaults = v, this._name = u, this.init()
  }

  function f(a) {
    a.element.trigger("change")
  }

  function g(b) {
    b.element.find("option").each(function(c, d) {
      var e = a(d);
      "undefined" == typeof e.data("original-index") && e.data("original-index", b.elementCount++), "undefined" == typeof e.data("_selected") && e.data("_selected", !1)
    })
  }

  function h(b, c, d) {
    b.element.find("option").each(function(b, e) {
      var f = a(e);
      f.data("original-index") === c && f.prop("selected", d)
    })
  }

  function i(a, b) {
    return a.replace(/\{(\d+)\}/g, function(a, c) {
      return "undefined" != typeof b[c] ? b[c] : a
    })
  }

  function j(a) {
    if (a.settings.infoText) {
      var b = a.elements.select1.find("option").length, c = a.elements.select2.find("option").length, d = a.element.find("option").length - a.selectedElements, e = a.selectedElements, f = "";
      f = 0 === d ? a.settings.infoTextEmpty : b === d ? i(a.settings.infoText, [b, d]) : i(a.settings.infoTextFiltered, [b, d]), a.elements.info1.html(f), a.elements.box1.toggleClass("filtered", !(b === d || 0 === d)), f = 0 === e ? a.settings.infoTextEmpty : c === e ? i(a.settings.infoText, [c, e]) : i(a.settings.infoTextFiltered, [c, e]), a.elements.info2.html(f), a.elements.box2.toggleClass("filtered", !(c === e || 0 === e))
    }
  }

  function k(b) {
    b.selectedElements = 0, b.elements.select1.empty(), b.elements.select2.empty(), b.element.find("option").each(function(c, d) {
      var e = a(d);
      e.prop("selected") ? (b.selectedElements++, b.elements.select2.append(e.clone(!0).prop("selected", e.data("_selected")))) : b.elements.select1.append(e.clone(!0).prop("selected", e.data("_selected")))
    }), b.settings.showFilterInputs && (l(b, 1), l(b, 2)), j(b)
  }

  function l(b, c) {
    if (b.settings.showFilterInputs) {
      m(b, c), b.elements["select" + c].empty().scrollTop(0);
      var d = new RegExp(a.trim(b.elements["filterInput" + c].val()), "gi"), e = b.element;
      e = 1 === c ? e.find("option").not(":selected") : e.find("option:selected"), e.each(function(e, f) {
        var g = a(f), h = !0;
        (f.text.match(d) || b.settings.filterOnValues && g.attr("value").match(d)) && ( h = !1, b.elements["select" + c].append(g.clone(!0).prop("selected", g.data("_selected")))), b.element.find("option").eq(g.data("original-index")).data("filtered" + c, h)
      }), j(b)
    }
  }

  function m(b, c) {
    b.elements["select" + c].find("option").each(function(c, d) {
      var e = a(d);
      b.element.find("option").eq(e.data("original-index")).data("_selected", e.prop("selected"))
    })
  }

  function n(b) {
    b.find("option").sort(function(b, c) {
      return a(b).data("original-index") > a(c).data("original-index") ? 1 : -1
    }).appendTo(b)
  }

  function o(a) {
    a.elements.select1.find("option").each(function() {
      a.element.find("option").data("_selected", !1)
    })
  }

  function p(b) {
    "all" !== b.settings.preserveSelectionOnMove || b.settings.moveOnSelect ? "moved" !== b.settings.preserveSelectionOnMove || b.settings.moveOnSelect || m(b, 1) : (m(b, 1), m(b, 2)), b.elements.select1.find("option:selected").each(function(c, d) {
      var e = a(d);
      e.data("filtered1") || h(b, e.data("original-index"), !0)
    }), k(b), f(b), n(b.elements.select2)
  }

  function q(b) {
    "all" !== b.settings.preserveSelectionOnMove || b.settings.moveOnSelect ? "moved" !== b.settings.preserveSelectionOnMove || b.settings.moveOnSelect || m(b, 2) : (m(b, 1), m(b, 2)), b.elements.select2.find("option:selected").each(function(c, d) {
      var e = a(d);
      e.data("filtered2") || h(b, e.data("original-index"), !1)
    }), k(b), f(b), n(b.elements.select1)
  }

  function r(b) {
    "all" !== b.settings.preserveSelectionOnMove || b.settings.moveOnSelect ? "moved" !== b.settings.preserveSelectionOnMove || b.settings.moveOnSelect || m(b, 1) : (m(b, 1), m(b, 2)), b.element.find("option").each(function(b, c) {
      var d = a(c);
      d.data("filtered1") || d.prop("selected", !0)
    }), k(b), f(b)
  }

  function s(b) {
    "all" !== b.settings.preserveSelectionOnMove || b.settings.moveOnSelect ? "moved" !== b.settings.preserveSelectionOnMove || b.settings.moveOnSelect || m(b, 2) : (m(b, 1), m(b, 2)), b.element.find("option").each(function(b, c) {
      var d = a(c);
      d.data("filtered2") || d.prop("selected", !1)
    }), k(b), f(b)
  }

  function t(a) {
    a.elements.form.submit(function(b) {
      a.elements.filterInput1.is(":focus") ? (b.preventDefault(), a.elements.filterInput1.focusout()) : a.elements.filterInput2.is(":focus") && (b.preventDefault(), a.elements.filterInput2.focusout())
    }), a.element.on("bootstrapDualListbox.refresh", function(b, c) {
      a.refresh(c)
    }), a.elements.filterClear1.on("click", function() {
      a.setNonSelectedFilter("", !0)
    }), a.elements.filterClear2.on("click", function() {
      a.setSelectedFilter("", !0)
    }), a.elements.moveButton.on("click", function() {
      p(a)
    }), a.elements.moveAllButton.on("click", function() {
      r(a)
    }), a.elements.removeButton.on("click", function() {
      q(a)
    }), a.elements.removeAllButton.on("click", function() {
      s(a)
    }), a.elements.filterInput1.on("change keyup", function() {
      l(a, 1)
    }), a.elements.filterInput2.on("change keyup", function() {
      l(a, 2)
    })
  }

  var u = "bootstrapDualListbox", v = {
    bootstrap2Compatible : !1,
    filterTextClear : "show all",
    filterPlaceHolder : "Filter",
    moveSelectedLabel : "Move selected",
    moveAllLabel : "Move all",
    removeSelectedLabel : "Remove selected",
    removeAllLabel : "Remove all",
    moveOnSelect : !0,
    preserveSelectionOnMove : !1,
    selectedListLabel : !1,
    nonSelectedListLabel : !1,
    helperSelectNamePostfix : "_helper",
    selectOrMinimalHeight : 100,
    showFilterInputs : !0,
    nonSelectedFilter : "",
    selectedFilter : "",
    infoText : "Showing all {0}",
    infoTextFiltered : '<span class="label label-warning">Filtered</span> {0} from {1}',
    infoTextEmpty : "Empty list",
    filterOnValues : !1
  }, w = /android/i.test(navigator.userAgent.toLowerCase());
  e.prototype = {
    init : function() {
      this.container = a('<div class="bootstrap-duallistbox-container"> <div class="box1">   <label></label>   <span class="info-container">     <span class="info"></span>     <button type="button" class="btn clear1 pull-right"></button>   </span>   <input class="filter" type="text">   <div class="btn-group buttons">     <button type="button" class="btn moveall">       <i></i>       <i></i>     </button>     <button type="button" class="btn move">       <i></i>     </button>   </div>   <select multiple="multiple"></select> </div> <div class="box2">   <label></label>   <span class="info-container">     <span class="info"></span>     <button type="button" class="btn clear2 pull-right"></button>   </span>   <input class="filter" type="text">   <div class="btn-group buttons">     <button type="button" class="btn remove">       <i></i>     </button>     <button type="button" class="btn removeall">       <i></i>       <i></i>     </button>   </div>   <select multiple="multiple"></select> </div></div>').insertBefore(this.element), this.elements = {
        originalSelect : this.element,
        box1 : a(".box1", this.container),
        box2 : a(".box2", this.container),
        filterInput1 : a(".box1 .filter", this.container),
        filterInput2 : a(".box2 .filter", this.container),
        filterClear1 : a(".box1 .clear1", this.container),
        filterClear2 : a(".box2 .clear2", this.container),
        label1 : a(".box1 > label", this.container),
        label2 : a(".box2 > label", this.container),
        info1 : a(".box1 .info", this.container),
        info2 : a(".box2 .info", this.container),
        select1 : a(".box1 select", this.container),
        select2 : a(".box2 select", this.container),
        moveButton : a(".box1 .move", this.container),
        removeButton : a(".box2 .remove", this.container),
        moveAllButton : a(".box1 .moveall", this.container),
        removeAllButton : a(".box2 .removeall", this.container),
        form : a(a(".box1 .filter",this.container)[0].form)
      }, this.originalSelectName = this.element.attr("name") || "";
      var b = "bootstrap-duallistbox-nonselected-list_" + this.originalSelectName, c = "bootstrap-duallistbox-selected-list_" + this.originalSelectName;
      return this.elements.select1.attr("id", b), this.elements.select2.attr("id", c), this.elements.label1.attr("for", b), this.elements.label2.attr("for", c), this.selectedElements = 0, this.elementCount = 0, this.setBootstrap2Compatible(this.settings.bootstrap2Compatible), this.setFilterTextClear(this.settings.filterTextClear), this.setFilterPlaceHolder(this.settings.filterPlaceHolder), this.setMoveSelectedLabel(this.settings.moveSelectedLabel), this.setMoveAllLabel(this.settings.moveAllLabel), this.setRemoveSelectedLabel(this.settings.removeSelectedLabel), this.setRemoveAllLabel(this.settings.removeAllLabel), this.setMoveOnSelect(this.settings.moveOnSelect), this.setPreserveSelectionOnMove(this.settings.preserveSelectionOnMove), this.setSelectedListLabel(this.settings.selectedListLabel), this.setNonSelectedListLabel(this.settings.nonSelectedListLabel), this.setHelperSelectNamePostfix(this.settings.helperSelectNamePostfix), this.setSelectOrMinimalHeight(this.settings.selectOrMinimalHeight), g(this), this.setShowFilterInputs(this.settings.showFilterInputs), this.setNonSelectedFilter(this.settings.nonSelectedFilter), this.setSelectedFilter(this.settings.selectedFilter), this.setInfoText(this.settings.infoText), this.setInfoTextFiltered(this.settings.infoTextFiltered), this.setInfoTextEmpty(this.settings.infoTextEmpty), this.setFilterOnValues(this.settings.filterOnValues), this.element.hide(), t(this), k(this), this.element
    },
    setBootstrap2Compatible : function(a, b) {
      return this.settings.bootstrap2Compatible = a, a ? (this.container.removeClass("row").addClass("row-fluid bs2compatible"), this.container.find(".box1, .box2").removeClass("col-md-6").addClass("span6"), this.container.find(".clear1, .clear2").removeClass("btn-default btn-xs").addClass("btn-mini"), this.container.find("input, select").removeClass("form-control"), this.container.find(".btn").removeClass("btn-default"), this.container.find(".moveall > i, .move > i").removeClass("glyphicon glyphicon-arrow-right").addClass("icon-arrow-right"), this.container.find(".removeall > i, .remove > i").removeClass("glyphicon glyphicon-arrow-left").addClass("icon-arrow-left")) : (this.container.removeClass("row-fluid bs2compatible").addClass("row"), this.container.find(".box1, .box2").removeClass("span6").addClass("col-md-6"), this.container.find(".clear1, .clear2").removeClass("btn-mini").addClass("btn-default btn-xs"), this.container.find("input, select").addClass("form-control"), this.container.find(".btn").addClass("btn-default"), this.container.find(".moveall > i, .move > i").removeClass("icon-arrow-right").addClass("glyphicon glyphicon-arrow-right"), this.container.find(".removeall > i, .remove > i").removeClass("icon-arrow-left").addClass("glyphicon glyphicon-arrow-left")), b && k(this), this.element
    },
    setFilterTextClear : function(a, b) {
      return this.settings.filterTextClear = a, this.elements.filterClear1.html(a), this.elements.filterClear2.html(a), b && k(this), this.element
    },
    setFilterPlaceHolder : function(a, b) {
      return this.settings.filterPlaceHolder = a, this.elements.filterInput1.attr("placeholder", a), this.elements.filterInput2.attr("placeholder", a), b && k(this), this.element
    },
    setMoveSelectedLabel : function(a, b) {
      return this.settings.moveSelectedLabel = a, this.elements.moveButton.attr("title", a), b && k(this), this.element
    },
    setMoveAllLabel : function(a, b) {
      return this.settings.moveAllLabel = a, this.elements.moveAllButton.attr("title", a), b && k(this), this.element
    },
    setRemoveSelectedLabel : function(a, b) {
      return this.settings.removeSelectedLabel = a, this.elements.removeButton.attr("title", a), b && k(this), this.element
    },
    setRemoveAllLabel : function(a, b) {
      return this.settings.removeAllLabel = a, this.elements.removeAllButton.attr("title", a), b && k(this), this.element
    },
    setMoveOnSelect : function(a, b) {
      if (w && ( a = !0), this.settings.moveOnSelect = a, this.settings.moveOnSelect) {
        this.container.addClass("moveonselect");
        var c = this;
        this.elements.select1.on("change", function() {
          p(c)
        }), this.elements.select2.on("change", function() {
          q(c)
        })
      } else
        this.container.removeClass("moveonselect"), this.elements.select1.off("change"), this.elements.select2.off("change");
      return b && k(this), this.element
    },
    setPreserveSelectionOnMove : function(a, b) {
      return w && ( a = !1), this.settings.preserveSelectionOnMove = a, b && k(this), this.element
    },
    setSelectedListLabel : function(a, b) {
      return this.settings.selectedListLabel = a, a ? this.elements.label2.show().html(a) : this.elements.label2.hide().html(a), b && k(this), this.element
    },
    setNonSelectedListLabel : function(a, b) {
      return this.settings.nonSelectedListLabel = a, a ? this.elements.label1.show().html(a) : this.elements.label1.hide().html(a), b && k(this), this.element
    },
    setHelperSelectNamePostfix : function(a, b) {
      return this.settings.helperSelectNamePostfix = a, a ? (this.elements.select1.attr("name", this.originalSelectName + a + "1"), this.elements.select2.attr("name", this.originalSelectName + a + "2")) : (this.elements.select1.removeAttr("name"), this.elements.select2.removeAttr("name")), b && k(this), this.element
    },
    setSelectOrMinimalHeight : function(a, b) {
      this.settings.selectOrMinimalHeight = a;
      var c = this.element.height();
      return this.element.height() < a && ( c = a), this.elements.select1.height(c), this.elements.select2.height(c), b && k(this), this.element
    },
    setShowFilterInputs : function(a, b) {
      return a ? (this.elements.filterInput1.show(), this.elements.filterInput2.show()) : (this.setNonSelectedFilter(""), this.setSelectedFilter(""), k(this), this.elements.filterInput1.hide(), this.elements.filterInput2.hide()), this.settings.showFilterInputs = a, b && k(this), this.element
    },
    setNonSelectedFilter : function(a, b) {
      return this.settings.showFilterInputs ? (this.settings.nonSelectedFilter = a, this.elements.filterInput1.val(a), b && k(this), this.element) :
      void 0
    },
    setSelectedFilter : function(a, b) {
      return this.settings.showFilterInputs ? (this.settings.selectedFilter = a, this.elements.filterInput2.val(a), b && k(this), this.element) :
      void 0
    },
    setInfoText : function(a, b) {
      return this.settings.infoText = a, b && k(this), this.element
    },
    setInfoTextFiltered : function(a, b) {
      return this.settings.infoTextFiltered = a, b && k(this), this.element
    },
    setInfoTextEmpty : function(a, b) {
      return this.settings.infoTextEmpty = a, b && k(this), this.element
    },
    setFilterOnValues : function(a, b) {
      return this.settings.filterOnValues = a, b && k(this), this.element
    },
    getContainer : function() {
      return this.container
    },
    refresh : function(a) {
      g(this), a ? o(this) : (m(this, 1), m(this, 2)), k(this)
    },
    destroy : function() {
      return this.container.remove(), this.element.show(), a.data(this, "plugin_" + u, null), this.element
    }
  }, a.fn[u] = function(b) {
    var c = arguments;
    if (b === d || "object" == typeof b)
      return this.each(function() {
        a(this).is("select") ? a.data(this, "plugin_" + u) || a.data(this, "plugin_" + u, new e(this, b)) : a(this).find("select").each(function(c, d) {
          a(d).bootstrapDualListbox(b)
        })
      });
    if ("string" == typeof b && "_" !== b[0] && "init" !== b) {
      var f;
      return this.each(function() {
        var d = a.data(this, "plugin_" + u);
        d instanceof e && "function" == typeof d[b] && ( f = d[b].apply(d, Array.prototype.slice.call(c, 1)))
      }), f !== d ? f : this
    }
  }
}(jQuery, window, document); 





  ;(function ($, window, document, undefined) {
  var pluginName = 'bootstrapDualListbox',
    defaults = {
      bootstrap2Compatible: false,
      filterTextClear: 'show all',
      filterPlaceHolder: 'Filter',
      moveSelectedLabel: 'Move selected',
      moveAllLabel: 'Move all',
      removeSelectedLabel: 'Remove selected',
      removeAllLabel: 'Remove all',
      moveOnSelect: true,                                                                 
      preserveSelectionOnMove: false,                                                     
      selectedListLabel: false,                                                           
      nonSelectedListLabel: false,                                                        
      helperSelectNamePostfix: '_helper',                                                 
      selectOrMinimalHeight: 100,
      showFilterInputs: true,                                                            
      nonSelectedFilter: '',                                                              
      selectedFilter: '',                                                                 
      infoText: 'Showing all {0}',                                                        
      infoTextFiltered: '<span class="label label-warning">Filtered</span> {0} from {1}', 
      infoTextEmpty: 'Empty list',                                                        
      filterOnValues: false                                                               
    },
    isBuggyAndroid = /android/i.test(navigator.userAgent.toLowerCase());

  function BootstrapDualListbox(element, options) {
    this.element = $(element);
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  function triggerChangeEvent(dualListbox) {
    dualListbox.element.trigger('change');
  }

  function updateSelectionStates(dualListbox) {
    dualListbox.element.find('option').each(function(index, item) {
      var $item = $(item);
      if (typeof($item.data('original-index')) === 'undefined') {
        $item.data('original-index', dualListbox.elementCount++);
      }
      if (typeof($item.data('_selected')) === 'undefined') {
        $item.data('_selected', false);
      }
    });
  }

  function changeSelectionState(dualListbox, original_index, selected) {
    dualListbox.element.find('option').each(function(index, item) {
      var $item = $(item);
      if ($item.data('original-index') === original_index) {
        $item.prop('selected', selected);
      }
    });
  }

  function formatString(s, args) {
    return s.replace(/\{(\d+)\}/g, function(match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  }

  function refreshInfo(dualListbox) {
    if (!dualListbox.settings.infoText) {
      return;
    }

    var visible1 = dualListbox.elements.select1.find('option').length,
      visible2 = dualListbox.elements.select2.find('option').length,
      all1 = dualListbox.element.find('option').length - dualListbox.selectedElements,
      all2 = dualListbox.selectedElements,
      content = '';

    if (all1 === 0) {
      content = dualListbox.settings.infoTextEmpty;
    } else if (visible1 === all1) {
      content = formatString(dualListbox.settings.infoText, [visible1, all1]);
    } else {
      content = formatString(dualListbox.settings.infoTextFiltered, [visible1, all1]);
    }

    dualListbox.elements.info1.html(content);
    dualListbox.elements.box1.toggleClass('filtered', !(visible1 === all1 || all1 === 0));

    if (all2 === 0) {
      content = dualListbox.settings.infoTextEmpty;
    } else if (visible2 === all2) {
      content = formatString(dualListbox.settings.infoText, [visible2, all2]);
    } else {
      content = formatString(dualListbox.settings.infoTextFiltered, [visible2, all2]);
    }

    dualListbox.elements.info2.html(content);
    dualListbox.elements.box2.toggleClass('filtered', !(visible2 === all2 || all2 === 0));
  }

  function refreshSelects(dualListbox) {
    dualListbox.selectedElements = 0;

    dualListbox.elements.select1.empty();
    dualListbox.elements.select2.empty();

    dualListbox.element.find('option').each(function(index, item) {
      var $item = $(item);
      if ($item.prop('selected')) {
        dualListbox.selectedElements++;
        dualListbox.elements.select2.append($item.clone(true).prop('selected', $item.data('_selected')));
      } else {
        dualListbox.elements.select1.append($item.clone(true).prop('selected', $item.data('_selected')));
      }
    });

    if (dualListbox.settings.showFilterInputs) {
      filter(dualListbox, 1);
      filter(dualListbox, 2);
    }
    refreshInfo(dualListbox);
  }

  function filter(dualListbox, selectIndex) {
    if (!dualListbox.settings.showFilterInputs) {
      return;
    }

    saveSelections(dualListbox, selectIndex);

    dualListbox.elements['select'+selectIndex].empty().scrollTop(0);
    var regex = new RegExp($.trim(dualListbox.elements['filterInput'+selectIndex].val()), 'gi'),
      options = dualListbox.element;

    if (selectIndex === 1) {
      options = options.find('option').not(':selected');
    } else  {
      options = options.find('option:selected');
    }

    options.each(function(index, item) {
      var $item = $(item),
        isFiltered = true;
      if (item.text.match(regex) || (dualListbox.settings.filterOnValues && $item.attr('value').match(regex) ) ) {
        isFiltered = false;
        dualListbox.elements['select'+selectIndex].append($item.clone(true).prop('selected', $item.data('_selected')));
      }
      dualListbox.element.find('option').eq($item.data('original-index')).data('filtered'+selectIndex, isFiltered);
    });

    refreshInfo(dualListbox);
  }

  function saveSelections(dualListbox, selectIndex) {
    dualListbox.elements['select'+selectIndex].find('option').each(function(index, item) {
      var $item = $(item);
      dualListbox.element.find('option').eq($item.data('original-index')).data('_selected', $item.prop('selected'));
    });
  }

  function sortOptions(select) {
    select.find('option').sort(function(a, b) {
      return ($(a).data('original-index') > $(b).data('original-index')) ? 1 : -1;
    }).appendTo(select);
  }

  function clearSelections(dualListbox) {
    dualListbox.elements.select1.find('option').each(function() {
      dualListbox.element.find('option').data('_selected', false);
    });
  }

  function move(dualListbox) {
    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
    }

    dualListbox.elements.select1.find('option:selected').each(function(index, item) {
      var $item = $(item);
      if (!$item.data('filtered1')) {
        changeSelectionState(dualListbox, $item.data('original-index'), true);
      }
    });

    refreshSelects(dualListbox);
    triggerChangeEvent(dualListbox);
    sortOptions(dualListbox.elements.select2);
  }

  function remove(dualListbox) {
    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 2);
    }

    dualListbox.elements.select2.find('option:selected').each(function(index, item) {
      var $item = $(item);
      if (!$item.data('filtered2')) {
        changeSelectionState(dualListbox, $item.data('original-index'), false);
      }
    });

    refreshSelects(dualListbox);
    triggerChangeEvent(dualListbox);
    sortOptions(dualListbox.elements.select1);
  }

  function moveAll(dualListbox) {
    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
    }

    dualListbox.element.find('option').each(function(index, item) {
      var $item = $(item);
      if (!$item.data('filtered1')) {
        $item.prop('selected', true);
      }
    });

    refreshSelects(dualListbox);
    triggerChangeEvent(dualListbox);
  }

  function removeAll(dualListbox) {
    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 2);
    }

    dualListbox.element.find('option').each(function(index, item) {
      var $item = $(item);
      if (!$item.data('filtered2')) {
        $item.prop('selected', false);
      }
    });

    refreshSelects(dualListbox);
    triggerChangeEvent(dualListbox);
  }

  function bindEvents(dualListbox) {
    dualListbox.elements.form.submit(function(e) {
      if (dualListbox.elements.filterInput1.is(':focus')) {
        e.preventDefault();
        dualListbox.elements.filterInput1.focusout();
      } else if (dualListbox.elements.filterInput2.is(':focus')) {
        e.preventDefault();
        dualListbox.elements.filterInput2.focusout();
      }
    });

    dualListbox.element.on('bootstrapDualListbox.refresh', function(e, mustClearSelections){
      dualListbox.refresh(mustClearSelections);
    });

    dualListbox.elements.filterClear1.on('click', function() {
      dualListbox.setNonSelectedFilter('', true);
    });

    dualListbox.elements.filterClear2.on('click', function() {
      dualListbox.setSelectedFilter('', true);
    });

    dualListbox.elements.moveButton.on('click', function() {
      move(dualListbox);
    });

    dualListbox.elements.moveAllButton.on('click', function() {
      moveAll(dualListbox);
    });

    dualListbox.elements.removeButton.on('click', function() {
      remove(dualListbox);
    });

    dualListbox.elements.removeAllButton.on('click', function() {
      removeAll(dualListbox);
    });

    dualListbox.elements.filterInput1.on('change keyup', function() {
      filter(dualListbox, 1);
    });

    dualListbox.elements.filterInput2.on('change keyup', function() {
      filter(dualListbox, 2);
    });
  }

  BootstrapDualListbox.prototype = {
    init: function () {
      this.container = $('' +
        '<div class="bootstrap-duallistbox-container">' +
        ' <div class="box1">' +
        '   <label></label>' +
        '   <span class="info-container">' +
        '     <span class="info"></span>' +
        '     <button type="button" class="btn clear1 pull-right"></button>' +
        '   </span>' +
        '   <input class="filter" type="text">' +
        '   <div class="btn-group buttons">' +
        '     <button type="button" class="btn moveall">' +
        '       <i></i>' +
        '       <i></i>' +
        '     </button>' +
        '     <button type="button" class="btn move">' +
        '       <i></i>' +
        '     </button>' +
        '   </div>' +
        '   <select multiple="multiple"></select>' +
        ' </div>' +
        ' <div class="box2">' +
        '   <label></label>' +
        '   <span class="info-container">' +
        '     <span class="info"></span>' +
        //'     <button type="button" class="btn clear2 pull-right"></button>' +
        '   </span>' +
        '   <input class="filter" type="text">' +
        '   <div class="btn-group buttons">' +
        '     <button type="button" class="btn remove">' +
        '       <i></i>' +
        '     </button>' +
        '     <button type="button" class="btn removeall">' +
        '       <i></i>' +
        '       <i></i>' +
        '     </button>' +
        '   </div>' +
        '   <select multiple="multiple"></select>' +
        ' </div>' +
        '</div>')
        .insertBefore(this.element);

      this.elements = {
        originalSelect: this.element,
        box1: $('.box1', this.container),
        box2: $('.box2', this.container),
        filterInput1: $('.box1 .filter', this.container),
        filterInput2: $('.box2 .filter', this.container),
        filterClear1: $('.box1 .clear1', this.container),
        filterClear2: $('.box2 .clear2', this.container),
        label1: $('.box1 > label', this.container),
        label2: $('.box2 > label', this.container),
        info1: $('.box1 .info', this.container),
        info2: $('.box2 .info', this.container),
        select1: $('.box1 select', this.container),
        select2: $('.box2 select', this.container),
        moveButton: $('.box1 .move', this.container),
        removeButton: $('.box2 .remove', this.container),
        moveAllButton: $('.box1 .moveall', this.container),
        removeAllButton: $('.box2 .removeall', this.container),
        form: $($('.box1 .filter', this.container)[0].form)
      };

      this.originalSelectName = this.element.attr('name') || '';
      var select1Id = 'bootstrap-duallistbox-nonselected-list_' + this.originalSelectName,
        select2Id = 'bootstrap-duallistbox-selected-list_' + this.originalSelectName;
      this.elements.select1.attr('id', select1Id);
      this.elements.select2.attr('id', select2Id);
      this.elements.label1.attr('for', select1Id);
      this.elements.label2.attr('for', select2Id);

      this.selectedElements = 0;
      this.elementCount = 0;
      this.setBootstrap2Compatible(this.settings.bootstrap2Compatible);
      this.setFilterTextClear(this.settings.filterTextClear);
      this.setFilterPlaceHolder(this.settings.filterPlaceHolder);
      this.setMoveSelectedLabel(this.settings.moveSelectedLabel);
      this.setMoveAllLabel(this.settings.moveAllLabel);
      this.setRemoveSelectedLabel(this.settings.removeSelectedLabel);
      this.setRemoveAllLabel(this.settings.removeAllLabel);
      this.setMoveOnSelect(this.settings.moveOnSelect);
      this.setPreserveSelectionOnMove(this.settings.preserveSelectionOnMove);
      this.setSelectedListLabel(this.settings.selectedListLabel);
      this.setNonSelectedListLabel(this.settings.nonSelectedListLabel);
      this.setHelperSelectNamePostfix(this.settings.helperSelectNamePostfix);
      this.setSelectOrMinimalHeight(this.settings.selectOrMinimalHeight);

      updateSelectionStates(this);

      this.setShowFilterInputs(this.settings.showFilterInputs);
      this.setNonSelectedFilter(this.settings.nonSelectedFilter);
      this.setSelectedFilter(this.settings.selectedFilter);
      this.setInfoText(this.settings.infoText);
      this.setInfoTextFiltered(this.settings.infoTextFiltered);
      this.setInfoTextEmpty(this.settings.infoTextEmpty);
      this.setFilterOnValues(this.settings.filterOnValues);

      this.element.hide();

      bindEvents(this);
      refreshSelects(this);

      return this.element;
    },
    setBootstrap2Compatible: function(value, refresh) {
      this.settings.bootstrap2Compatible = value;
      if (value) {
        this.container.removeClass('row').addClass('row-fluid bs2compatible');
        this.container.find('.box1, .box2').removeClass('col-md-6').addClass('span6');
        this.container.find('.clear1, .clear2').removeClass('btn-default btn-xs').addClass('btn-mini');
        this.container.find('input, select').removeClass('form-control');
        this.container.find('.btn').removeClass('btn-default');
        this.container.find('.moveall > i, .move > i').removeClass('glyphicon glyphicon-arrow-right').addClass('icon-arrow-right');
        this.container.find('.removeall > i, .remove > i').removeClass('glyphicon glyphicon-arrow-left').addClass('icon-arrow-left');
      } else {
        this.container.removeClass('row-fluid bs2compatible').addClass('row');
        this.container.find('.box1, .box2').removeClass('span6').addClass('col-md-6');
        this.container.find('.clear1, .clear2').removeClass('btn-mini').addClass('btn-default btn-xs');
        this.container.find('input, select').addClass('form-control');
        this.container.find('.btn').addClass('btn-default');
        this.container.find('.moveall > i, .move > i').removeClass('icon-arrow-right').addClass('glyphicon glyphicon-arrow-right');
        this.container.find('.removeall > i, .remove > i').removeClass('icon-arrow-left').addClass('glyphicon glyphicon-arrow-left');
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setFilterTextClear: function(value, refresh) {
      this.settings.filterTextClear = value;
      this.elements.filterClear1.html(value);
      this.elements.filterClear2.html(value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setFilterPlaceHolder: function(value, refresh) {
      this.settings.filterPlaceHolder = value;
      this.elements.filterInput1.attr('placeholder', value);
      this.elements.filterInput2.attr('placeholder', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setMoveSelectedLabel: function(value, refresh) {
      this.settings.moveSelectedLabel = value;
      this.elements.moveButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setMoveAllLabel: function(value, refresh) {
      this.settings.moveAllLabel = value;
      this.elements.moveAllButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setRemoveSelectedLabel: function(value, refresh) {
      this.settings.removeSelectedLabel = value;
      this.elements.removeButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setRemoveAllLabel: function(value, refresh) {
      this.settings.removeAllLabel = value;
      this.elements.removeAllButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setMoveOnSelect: function(value, refresh) {
      if (isBuggyAndroid) {
        value = true;
      }
      this.settings.moveOnSelect = value;
      if (this.settings.moveOnSelect) {
        this.container.addClass('moveonselect');
        var self = this;
        this.elements.select1.on('change', function() {
          move(self);
        });
        this.elements.select2.on('change', function() {
          remove(self);
        });
      } else {
        this.container.removeClass('moveonselect');
        this.elements.select1.off('change');
        this.elements.select2.off('change');
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setPreserveSelectionOnMove: function(value, refresh) {
      // We are forcing to move on select and disabling preserveSelectionOnMove on Android
      if (isBuggyAndroid) {
        value = false;
      }
      this.settings.preserveSelectionOnMove = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setSelectedListLabel: function(value, refresh) {
      this.settings.selectedListLabel = value;
      if (value) {
        this.elements.label2.show().html(value);
      } else {
        this.elements.label2.hide().html(value);
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setNonSelectedListLabel: function(value, refresh) {
      this.settings.nonSelectedListLabel = value;
      if (value) {
        this.elements.label1.show().html(value);
      } else {
        this.elements.label1.hide().html(value);
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setHelperSelectNamePostfix: function(value, refresh) {
      this.settings.helperSelectNamePostfix = value;
      if (value) {
        this.elements.select1.attr('name', this.originalSelectName + value + '1');
        this.elements.select2.attr('name', this.originalSelectName + value + '2');
      } else {
        this.elements.select1.removeAttr('name');
        this.elements.select2.removeAttr('name');
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setSelectOrMinimalHeight: function(value, refresh) {
      this.settings.selectOrMinimalHeight = value;
      var height = this.element.height();
      if (this.element.height() < value) {
        height = value;
      }
      this.elements.select1.height(height);
      this.elements.select2.height(height);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setShowFilterInputs: function(value, refresh) {
      if (!value) {
        this.setNonSelectedFilter('');
        this.setSelectedFilter('');
        refreshSelects(this);
        this.elements.filterInput1.hide();
        this.elements.filterInput2.hide();
      } else {
        this.elements.filterInput1.show();
        this.elements.filterInput2.show();
      }
      this.settings.showFilterInputs = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setNonSelectedFilter: function(value, refresh) {
      if (this.settings.showFilterInputs) {
        this.settings.nonSelectedFilter = value;
        this.elements.filterInput1.val(value);
        if (refresh) {
          refreshSelects(this);
        }
        return this.element;
      }
    },
    setSelectedFilter: function(value, refresh) {
      if (this.settings.showFilterInputs) {
        this.settings.selectedFilter = value;
        this.elements.filterInput2.val(value);
        if (refresh) {
          refreshSelects(this);
        }
        return this.element;
      }
    },
    setInfoText: function(value, refresh) {
      this.settings.infoText = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setInfoTextFiltered: function(value, refresh) {
      this.settings.infoTextFiltered = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setInfoTextEmpty: function(value, refresh) {
      this.settings.infoTextEmpty = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setFilterOnValues: function(value, refresh) {
      this.settings.filterOnValues = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    getContainer: function() {
      return this.container;
    },
    refresh: function(mustClearSelections) {
      updateSelectionStates(this);

      if (!mustClearSelections) {
        saveSelections(this, 1);
        saveSelections(this, 2);
      } else {
        clearSelections(this);
      }

      refreshSelects(this);
    },
    destroy: function() {
      this.container.remove();
      this.element.show();
      $.data(this, 'plugin_' + pluginName, null);
      return this.element;
    }
  };

  $.fn[ pluginName ] = function (options) {
    var args = arguments;

    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$(this).is('select')) {
          $(this).find('select').each(function(index, item) {
            $(item).bootstrapDualListbox(options);
          });
        } else if (!$.data(this, 'plugin_' + pluginName)) {

          $.data(this, 'plugin_' + pluginName, new BootstrapDualListbox(this, options));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (instance instanceof BootstrapDualListbox && typeof instance[options] === 'function') {
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }
      });

     return returns !== undefined ? returns : this;
    }

  };

})(jQuery, window, document);







