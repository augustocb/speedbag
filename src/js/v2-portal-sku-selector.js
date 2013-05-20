(function() {
  var $, calculateUniqueDimensions, createDimensionsMap, disableInvalidInputs, findUndefinedDimensions, formatCurrency, renderSkuSelector, resetNextDimensions, sanitize, selectableSkus, selectedSku,
    _this = this;

  $ = window.jQuery;

  $.fn.skuSelector = function(options) {
    var opts, skuVariationsDoneHandler, skuVariationsFailHandler, _base;

    if (options == null) {
      options = {};
    }
    opts = $.extend(options, $.fn.skuSelector.defaults);
    (_base = $.skuSelector).$placeholder || (_base.$placeholder = $(this));
    $.skuSelector.$placeholder.addClass('sku-selector-loading');
    console.log('fn.skuSelector', $.skuSelector.$placeholder, opts);
    skuVariationsDoneHandler = function(json) {
      var skuSelector, _base1;

      $.skuSelector.$placeholder.removeClass('sku-selector-loading');
      if (json.dimensions.length === 0) {
        return $.skuSelector.addSkuToCart(json.skus[0].sku);
      } else {
        skuSelector = $.skuSelector.createSkuSelector(json.name, json.dimensions, json.skus, opts);
        $.skuSelector.$placeholder.html(skuSelector);
        return typeof (_base1 = $.skuSelector.$placeholder).showPopup === "function" ? _base1.showPopup() : void 0;
      }
    };
    skuVariationsFailHandler = function(reason) {
      $.skuSelector.$placeholder.removeClass('sku-selector-loading');
      console.error(reason);
      if (opts.productUrl) {
        return window.location.href = opts.productUrl;
      }
    };
    if (opts.skuVariations) {
      return skuVariationsDoneHandler(opts.skuVariations);
    } else if (opts.skuVariationsPromise) {
      opts.skuVariationsPromise.done(skuVariationsDoneHandler);
      return opts.skuVariationsPromise.fail(skuVariationsFailHandler);
    } else {
      return console.error('You must either provide a JSON or a Promise');
    }
  };

  $.fn.skuSelector.defaults = {
    skuVariationsPromise: void 0,
    skuVariations: void 0,
    mainTemplate: "<div class=\"sku-selector-wrap\">\n		<span class=\"sku-selector-exit-button\">X</span>\n		<div class=\"sku-selector-content\" style=\"background-image: none;\">\n				<div class=\"selectSkuTitle\">Selecione a variação do produto</div>\n				<div class=\"sku-selector-prodTitle\">{{productName}}</div>\n				<div class=\"sku-selector-skusWrap\">\n					<div class=\"sku-selector-skuProductImage\">\n							<img src=\"{{image}}\"\n								width=\"160\" height=\"160\" alt=\"{{productAlt}}\">\n					</div>\n						<div class=\"skuListWrap_\">\n								{{dimensionLists}}\n						</div>\n						<div class=\"sku-selector-text-warning\"></div>\n				</div>\n				<div class=\"sku-selector-buttonWrap clearfix\">\n						<div class=\"sku-selector-skuProductPrice\">\n							<span id=\"skuPrice\"></span>\n							<div class=\"newPrice\"></div>\n							<div class=\"installment\"></div>\n						</div>\n						<a href=\"#\" class=\"sku-selector-buyButton\">Comprar</a>\n				</div>\n		</div>\n</div>",
    dimensionListTemplate: "<ul class=\"topic {{dimensionSanitized}} dimension-{{dimensionIndex}}\">\n	<li class=\"specification\">\n		{{dimension}}\n	</li>\n	<li class=\"select skuList\">\n	<span class=\"group\">\n		{{skuList}}\n	</span>\n	</li>\n</ul>",
    skuDimensionTemplate: "<span class=\"dimension-wrap\">\n	<input type=\"radio\" name=\"dimension-{{dimensionSanitized}}\" dimension=\"{{dimensionSanitized}}\" data-value=\"{{value}}\" data-dimension=\"{{dimension}}\"\n		class=\"sku-selector skuespec_{{dimensionSanitized}}_opcao_{{valueSanitized}} dimension dimension-{{dimensionSanitized}}\" id=\"espec_{{dimensionSanitized}}_opcao_{{index}}\" value=\"{{valueSanitized}}\">\n	<label for=\"espec_{{dimensionSanitized}}_opcao_{{index}}\" class=\"dimension-{{dimensionSanitized}}\">{{value}}</label>\n</span>"
  };

  $.skuSelector = function(action, options) {
    var opts;

    if (action == null) {
      action = "popup";
    }
    if (options == null) {
      options = {};
    }
    opts = $.extend(options, $.skuSelector.defaults);
    console.log('skuSelector', opts);
    $.skuSelector.$overlay = $(opts.overlayTemplate);
    if (opts.overlayClass) {
      $.skuSelector.$overlay.addClass(opts.overlayClass);
    }
    if (opts.overlayId) {
      $.skuSelector.$overlay.attr('id', opts.overlayId);
    }
    $.skuSelector.$placeholder = $(opts.popupTemplate);
    if (opts.popupClass) {
      $.skuSelector.$placeholder.addClass(opts.popupClass);
    }
    if (opts.popupId) {
      $.skuSelector.$placeholder.attr('id', opts.popupId);
    }
    $('body').append($.skuSelector.$overlay);
    $('body').append($.skuSelector.$placeholder);
    $.skuSelector.$placeholder.showPopup = function() {
      var _ref, _ref1;

      if ((_ref = $.skuSelector.$overlay) != null) {
        _ref.fadeIn();
      }
      return (_ref1 = $.skuSelector.$placeholder) != null ? _ref1.fadeIn() : void 0;
    };
    $.skuSelector.$placeholder.hidePopup = function() {
      var _ref, _ref1;

      if ((_ref = $.skuSelector.$overlay) != null) {
        _ref.fadeOut();
      }
      return (_ref1 = $.skuSelector.$placeholder) != null ? _ref1.fadeOut() : void 0;
    };
    $.skuSelector.$overlay.click($.skuSelector.$placeholder.hidePopup);
    $.skuSelector.$placeholder.on('click', '.sku-selector-exit-button', function() {
      $.skuSelector.$placeholder.hidePopup();
      return console.log('Exiting sku selector');
    });
    return $.skuSelector.$placeholder;
  };

  $.skuSelector.defaults = {
    popupTemplate: '<div style="display: none; position:fixed"></div>',
    overlayTemplate: '<div></div>',
    overlayId: 'sku-selector-overlay',
    overlayClass: void 0,
    popupId: 'sku-selector-popup',
    popupClass: 'sku-selector'
  };

  $.skuSelector.getSkusForProduct = function(productId) {
    console.log('getSkusForProduct', productId);
    return $.get('/api/catalog_system/pub/products/variations/' + productId);
  };

  $.skuSelector.addSkuToCart = function(sku) {
    var promise, skuCartAddURL, skuCartRedirectAddURL, _base;

    if (typeof (_base = $.skuSelector.$placeholder).hidePopup === "function") {
      _base.hidePopup();
    }
    console.log('Adding SKU to cart:', sku);
    skuCartAddURL = '/checkout/cart/add?qty=1&seller=1&redirect=false&sku=' + sku;
    skuCartRedirectAddURL = '/checkout/cart/add?qty=1&seller=1&sku=' + sku;
    promise = $.get(skuCartAddURL);
    promise.done(function(data) {
      if (vtexMinicartShowMinicart) {
        vtexMinicartShowMinicart();
      }
      return console.log('Item adicionado com sucesso', sku, data);
    });
    return promise.fail(function(jqXHR, status) {
      console.log(jqXHR != null ? jqXHR.status : void 0, status);
      console.log('Erro ao adicionar item', sku);
      return window.location.href = skuCartRedirectAddURL;
    });
  };

  $.skuSelector.buyButtonClickHandler = function(event) {
    var id;

    event.preventDefault();
    id = $(event.target).parents('li').find('h2').next().attr('id').replace('rating-produto-', '');
    $.skuSelector.$placeholder.skuSelector({
      skuVariationsPromise: $.skuSelector.getSkusForProduct(id),
      productUrl: $(event.target).attr('href')
    });
    return false;
  };

  $.skuSelector.bindClickHandlers = function(className) {
    var $elements;

    $elements = $('.' + className);
    console.log('Binding to', $elements.length);
    $elements.removeClass(className);
    return $elements.click($.skuSelector.buyButtonClickHandler);
  };

  $.skuSelector.createSkuSelector = function(name, dimensions, skus, options) {
    var $template, buyButtonHandler, dimension, dimensionChangeHandler, renderedTemplate, selectedDimensionsMap, uniqueDimensionsMap, _i, _len;

    selectedDimensionsMap = createDimensionsMap(dimensions);
    uniqueDimensionsMap = calculateUniqueDimensions(dimensions, skus);
    console.log('skuSelector uniqueDimensionsMap', uniqueDimensionsMap);
    renderedTemplate = renderSkuSelector(skus[0].image, name, uniqueDimensionsMap, options.mainTemplate, options.dimensionListTemplate, options.skuDimensionTemplate);
    $template = $(renderedTemplate);
    disableInvalidInputs(uniqueDimensionsMap, findUndefinedDimensions(selectedDimensionsMap), selectableSkus(skus, selectedDimensionsMap), $template);
    buyButtonHandler = function(event) {
      var errorMessage, sku;

      event.preventDefault();
      sku = selectedSku(skus, selectedDimensionsMap);
      if (sku) {
        $.skuSelector.addSkuToCart(sku.sku);
      } else {
        errorMessage = 'Por favor, escolha: ' + findUndefinedDimensions(selectedDimensionsMap)[0];
        $('.sku-selector-text-warning', $template).show().text(errorMessage);
      }
      return false;
    };
    dimensionChangeHandler = function() {
      var dimensionName, dimensionValue, installmentValue, installments, price, selectedSkuObj, undefinedDimensions;

      dimensionName = $(this).attr('data-dimension');
      dimensionValue = $(this).attr('data-value');
      $('label.dimension-' + sanitize(dimensionName)).removeClass('checked');
      $('label[for="' + $(this).attr('id') + '"]', $template).addClass('checked');
      console.log('Change dimension!', dimensionName, dimensionValue);
      selectedDimensionsMap[dimensionName] = dimensionValue;
      resetNextDimensions(dimensionName, selectedDimensionsMap);
      disableInvalidInputs(uniqueDimensionsMap, findUndefinedDimensions(selectedDimensionsMap), selectableSkus(skus, selectedDimensionsMap), $template);
      selectedSkuObj = selectedSku(skus, selectedDimensionsMap);
      undefinedDimensions = findUndefinedDimensions(selectedDimensionsMap);
      if (selectedSkuObj && undefinedDimensions.length <= 1) {
        if (undefinedDimensions.length === 1) {
          $('input:enabled[dimension="' + sanitize(undefinedDimensions[0]) + '"]', $template).attr('checked', 'checked').change();
        }
        price = formatCurrency(selectedSkuObj.bestPrice);
        installments = selectedSkuObj.installments;
        installmentValue = formatCurrency(selectedSkuObj.installmentsValue);
        $('div.newPrice').text('Por: R$ ' + price);
        if (installments > 1) {
          $('div.installment').text('ou até ' + installments + 'x de R$ ' + installmentValue);
        }
        $('.sku-selector-skuProductPrice').fadeIn();
      } else {
        $('.sku-selector-skuProductPrice').fadeOut();
      }
      return console.log(selectedDimensionsMap, selectedSkuObj);
    };
    for (_i = 0, _len = dimensions.length; _i < _len; _i++) {
      dimension = dimensions[_i];
      $('ul.' + sanitize(dimension) + ' input', $template).change(dimensionChangeHandler);
    }
    $('.sku-selector-buyButton', $template).click(buyButtonHandler);
    return $template;
  };

  sanitize = function(str) {
    var plain, regex, specialChars;

    if (str == null) {
      str = this;
    }
    specialChars = "ąàáäâãåæćęèéëêìíïîłńòóöôõøśùúüûñçżź";
    plain = "aaaaaaaaceeeeeiiiilnoooooosuuuunczz";
    regex = new RegExp('[' + specialChars + ']', 'g');
    str += "";
    return str.replace(regex, function(char) {
      return plain.charAt(specialChars.indexOf(char));
    }).replace(/\s/g, '').replace(/\(|\)|\'|\"/g, '').toLowerCase();
  };

  formatCurrency = function(value) {
    if ((value != null) && !isNaN(value)) {
      return parseFloat(value / 100).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
    } else {
      return "Grátis";
    }
  };

  createDimensionsMap = function(dimensions) {
    var dimension, selectedDimensionsMap, _i, _len;

    selectedDimensionsMap = {};
    for (_i = 0, _len = dimensions.length; _i < _len; _i++) {
      dimension = dimensions[_i];
      selectedDimensionsMap[dimension] = void 0;
    }
    return selectedDimensionsMap;
  };

  findUndefinedDimensions = function(selectedDimensionsMap) {
    var key, value, _ref;

    return (_ref = (function() {
      var _results;

      _results = [];
      for (key in selectedDimensionsMap) {
        value = selectedDimensionsMap[key];
        if (value === void 0) {
          _results.push(key);
        }
      }
      return _results;
    })()) != null ? _ref : [];
  };

  resetNextDimensions = function(dimensionName, selectedDimensionsMap) {
    var foundCurrent, key, _results;

    foundCurrent = false;
    _results = [];
    for (key in selectedDimensionsMap) {
      if (foundCurrent) {
        selectedDimensionsMap[key] = void 0;
      }
      if (key === dimensionName) {
        _results.push(foundCurrent = true);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  calculateUniqueDimensions = function(dimensions, skus) {
    var dim, dimension, sku, skuDimension, uniqueDimensionsMap, _i, _j, _len, _len1;

    uniqueDimensionsMap = {};
    for (_i = 0, _len = dimensions.length; _i < _len; _i++) {
      dimension = dimensions[_i];
      uniqueDimensionsMap[dimension] = [];
      for (_j = 0, _len1 = skus.length; _j < _len1; _j++) {
        sku = skus[_j];
        skuDimension = ((function() {
          var _k, _len2, _ref, _results;

          _ref = sku.dimensions;
          _results = [];
          for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
            dim = _ref[_k];
            if (dim.Key === dimension) {
              _results.push(dim);
            }
          }
          return _results;
        })())[0].Value;
        if (uniqueDimensionsMap[dimension].indexOf(skuDimension) === -1) {
          uniqueDimensionsMap[dimension].push(skuDimension);
        }
      }
    }
    return uniqueDimensionsMap;
  };

  selectableSkus = function(skus, selectedDimensionsMap) {
    var dim, dimension, dimensionValue, i, match, selectableArray, sku, skuDimensionValue, _i;

    selectableArray = skus.slice(0);
    for (i = _i = selectableArray.length - 1; _i >= 0; i = _i += -1) {
      sku = selectableArray[i];
      match = true;
      for (dimension in selectedDimensionsMap) {
        dimensionValue = selectedDimensionsMap[dimension];
        if (!(dimensionValue !== void 0)) {
          continue;
        }
        skuDimensionValue = ((function() {
          var _j, _len, _ref, _results;

          _ref = sku.dimensions;
          _results = [];
          for (_j = 0, _len = _ref.length; _j < _len; _j++) {
            dim = _ref[_j];
            if (dim.Key === dimension) {
              _results.push(dim);
            }
          }
          return _results;
        })())[0].Value;
        if (skuDimensionValue !== dimensionValue) {
          match = false;
          continue;
        }
      }
      if (!match) {
        selectableArray.splice(i, 1);
      }
    }
    return selectableArray;
  };

  selectedSku = function(skus, selectedDimensionsMap) {
    var s;

    s = selectableSkus(skus, selectedDimensionsMap);
    if (s.length === 1) {
      return s[0];
    } else {
      return void 0;
    }
  };

  renderSkuSelector = function(image, name, uniqueDimensionsMap, mainTemplate, dimensionListTemplate, skuDimensionTemplate) {
    var dimension, dimensionIndex, dimensionValues, dl, i, renderedTemplate, skuList, value, _i, _len;

    dl = '';
    dimensionIndex = 0;
    for (dimension in uniqueDimensionsMap) {
      dimensionValues = uniqueDimensionsMap[dimension];
      skuList = '';
      for (i = _i = 0, _len = dimensionValues.length; _i < _len; i = ++_i) {
        value = dimensionValues[i];
        skuList += skuDimensionTemplate.replace(/\{\{dimension\}\}/g, dimension).replace(/\{\{dimensionSanitized\}\}/g, sanitize(dimension)).replace(/\{\{index\}\}/g, i).replace(/\{\{value\}\}/g, value).replace(/\{\{valueSanitized\}\}/g, sanitize(value));
      }
      dl += dimensionListTemplate.replace(/\{\{dimension\}\}/g, dimension).replace(/\{\{dimensionSanitized\}\}/g, sanitize(dimension)).replace(/\{\{skuList\}\}/g, skuList).replace(/\{\{dimensionIndex\}\}/g, dimensionIndex++);
    }
    renderedTemplate = mainTemplate.replace('{{image}}', image).replace('{{productAlt}}', name).replace('{{productName}}', name).replace('{{dimensionLists}}', dl);
    return renderedTemplate;
  };

  disableInvalidInputs = function(uniqueDimensionsMap, undefinedDimensions, selectableSkus, $template) {
    var $value, dim, dimension, firstUndefinedDimensionName, sku, skuDimensionValue, value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;

    firstUndefinedDimensionName = undefinedDimensions[0];
    if (!firstUndefinedDimensionName) {
      return;
    }
    $('input[dimension="' + sanitize(firstUndefinedDimensionName) + '"]', $template).attr('disabled', 'disabled');
    $('ul label.dimension-' + sanitize(firstUndefinedDimensionName), $template).addClass('disabled');
    $('input[dimension="' + sanitize(firstUndefinedDimensionName) + '"]', $template).removeAttr('checked');
    $('ul label.dimension-' + sanitize(firstUndefinedDimensionName), $template).removeClass('checked');
    _ref = uniqueDimensionsMap[firstUndefinedDimensionName];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      value = _ref[_i];
      for (_j = 0, _len1 = selectableSkus.length; _j < _len1; _j++) {
        sku = selectableSkus[_j];
        skuDimensionValue = ((function() {
          var _k, _len2, _ref1, _results;

          _ref1 = sku.dimensions;
          _results = [];
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            dim = _ref1[_k];
            if (dim.Key === firstUndefinedDimensionName) {
              _results.push(dim);
            }
          }
          return _results;
        })())[0].Value;
        if (skuDimensionValue === value && sku.available) {
          $value = $('input[dimension="' + sanitize(firstUndefinedDimensionName) + '"][value="' + sanitize(value) + '"]', $template);
          $value.removeAttr('disabled');
          $('ul label[for="' + $value.attr('id') + '"]', $template).removeClass('disabled');
        }
      }
    }
    _ref1 = undefinedDimensions.slice(1);
    _results = [];
    for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
      dimension = _ref1[_k];
      _results.push($('input[dimension="' + sanitize(dimension) + '"]', $template).each(function() {
        console.log('Disabling next dimensions', this);
        $(this).attr('disabled', 'disabled');
        $('ul label.dimension-' + sanitize(dimension), $template).addClass('disabled');
        $(this).removeAttr('checked');
        return $('ul label.dimension-' + sanitize(dimension), $template).removeClass('checked');
      }));
    }
    return _results;
  };

}).call(this);
