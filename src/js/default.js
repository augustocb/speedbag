$(document).ready(function(){
    $("fieldset.busca select").change(function()
    {
        $("fieldset.busca option:selected").each(function()
        {
            $("div.select").text($(this).text());
        });
    });

    // BARRA DE PRECO LATERAL
    $(window).scroll(function(){  
        posScroll = $(document).scrollTop();  
        if(posScroll >=400)  
            $('#PrecoLateral').fadeIn(300);
        else  
            $('#PrecoLateral').fadeOut(300);
    });
            
    $('#PrecoLateral .FecharPrecoLateral').click(function(){
        $('#PrecoLateral').animate({
            paddingRight: '20px'
        }, 250);
        $('#PrecoLateral').delay(150);
        $('#PrecoLateral').animate({
            right: '-350px',
            opacity: '0'
        }, 350);
    })

    $("#PrecoLateral a.buy-button").click(function() {
        $('html, body').animate({
            scrollTop: $("#container").offset().top
        }, 1000);
    });
    if ($.browser.msie) {
        if(parseInt($.browser.version) == 7){
          document.getElementById('PrecoLateral').setAttribute('className', 'ie7');
        }
        if(parseInt($.browser.version) == 8){
          document.getElementById('PrecoLateral').setAttribute('class', 'ie8');
        }
        if(parseInt($.browser.version) == 9){
          document.getElementById('PrecoLateral').setAttribute('class', 'ie');
        }
    }
    // FIM BARRA DE PRECO LATERAL
    
    $('.closeFloater').click(function(){
        $('#convercaoFlutuante').hide();
    });
});
/// <reference path="jquery-1.7.2-vsdoc.js" />

var sidebar = function() {
    if ($('body').hasClass('home')) {
        $(".subMenu .menu-departamento ul").each(function() {
            var $this = $(this);
            if ($this.children().length == 0) $this.hide();

            if ($this.find("li").length > 3) {
                $this.find("li:gt(2)").hide().addClass("hide_items");
                $this.append("<li class='menu_show_all'>veja mais</li><li class='menu_hidden_all hide'>recolher</li>");

                $this.find(".menu_show_all").bind("click", function() {
                    $this.find(".hide_items").show(250);
                    jQuery(this).hide();
                    $this.find(".menu_hidden_all").show();
                });

                $this.find(".menu_hidden_all").bind("click", function() {
                    $this.find(".menu_show_all").show();
                    $(this).hide();
                    $this.find(".hide_items").hide(250);
                });
            }
        });
    }

};

var quickview = function() {
    $('.prateleira li').hover(
        function() {
            $(this).find('.view').fadeIn('400');
        },
        function() {
        $(this).find('.view').fadeOut('400');
        }
    );
};

// ConfiguraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o do Slider
var slider = function() {
    if ($(".bannerContent").length > 0)
        $(".bannerContent").cycle({
            fx: "fade",
            speed: 1000,
            timeout: 5000,
            pager: '.pager'
        });
};

function abreChat() {
    var pop_window = window.open("about:blank", "janela", "width=650,height=450,resizable=0,toolbar=0,location=0,directories=0,status=1,menubar=0");
    pop_window.focus();
    document.getElementById('auto').submit();
}

var newsletter = function() {
    var elem = $(".newsletter");
    if (elem.length > 0) {
        function setHtml() {
            var error = $("input.newsletter-error");
            var success = $("input.newsletter-success");
            var success2 = $("input.newsletter-success2");
            var pop1 = '<div id="popUp"> <div class="popTitle"> <span class="title">AtenÃƒÂ§ÃƒÂ£o!</span> <span class="close"></span> </div> <div class="erro"> ';
            var pop2 = '</div> </div><div id="overlay"></div>';
            if (typeof (error) != "undefined" && error.length > 0 && error.val().search(/popUpNewsletter/i) < 0) {
                var errorText = pop1 + "<div class='error'>" + error.val() + "</div>" + pop2;
                var successText = pop1 + "<div class='success'><div class='success1'>" + success.val() + "</div><div class='success2'>" + success2.val() + "</div></div>" + pop2;
                error.val(errorText);
                success.val(successText);
                success2.val("");
            }
        }
        elem.delegate("#overlay, span.close", "click", function() {
            $('#overlay, div#popUp').fadeOut();
            $(".newsletter-button-back").trigger("click");
            setTimeout(function() {
                setHtml();
                if ($("fieldset.success").length > 0) document.location.reload();
            }, 100);
        });
        setHtml();
    }
};

$(function() {
    popReferAFriend.init();
    openPaymentMethod.init();
    openEmailMsg.init();
    newsletter();
    slider();
    sidebar();    

    $(".subDepartamentos .menu-departamento ul").each(function() { $(this).prepend("<li class='titulo'>" + $(this).prev().html() + "</li>") });

    if ($('body.produto').length > 0) {
        $('.giftlist .giftlistinsertsku-message:last').attr('style', 'display:none');
    }

    if ($('body').attr('class') == 'listas lista-criar') {
        listAddressError.init();
    }

    //Submenu   
    var menuOutObject;
    var menuOutTimer;
    $(function() {
        var listWidth = $('.botaoDepartamentos').width();

        $('.botaoDepartamentos').hover(
            function() {
                menuOutObject = $(this).next();

                if (!menuOutObject.is(':visible')) {
                    hideMenuSubItems($('.subDepartamentos:visible'));
                    $(this).addClass('active');
                }
                clearTimeout(menuOutTimer);
                menuOutObject.stop(true, true).slideDown();
            },
            function() {
                menuOutTimer = setTimeout(function() {
                    hideMenuSubItems(menuOutObject);
                }, 10);
            }
        );

        $('.subDepartamentos').hover(
            function() {
                menuOutObject = $(this);
                clearTimeout(menuOutTimer);
            },
            function() {
                menuOutTimer = setTimeout(function() {
                    hideMenuSubItems(menuOutObject);
                }, 10);
            }
        );
    });

    function hideMenuSubItems(o) {
        $('.botaoDepartamentos').removeClass('active');
        o.stop(true, true).slideUp();
    }

    //Google +1
    $(".googleMais").html('<g:plusone size="medium"></g:plusone>');

    //Abas
    $('.lista-abas li').live('click', function() {
        if ($(this).attr('class').indexOf('active') == -1) {
            $('.lista-abas li').removeClass("active");
            $(this).addClass("active");
            $('.abaConteudo > div').hide();
            $('.abaConteudo > div').eq($(this).index()).fadeIn();
        }
        else {
            return false;
        }
    });

    //Menu
    $('.menu-navegue').prepend('<h3>Filtrar</h3>');

    //Calcular frete
    $('.shipping-value').text('Calcular prazo de entrega');
    $('.openShipping').click(function() {
        $('.shipping-value').click().hide();
        $('.shippingCalc').css('visibylity', 'visible');
        $('<a href="#" class="fechar">Fechar</a>')
                .appendTo('.calcFrete')
                .fadeIn(400)
                .click(function() { $(this).fadeOut(); hidePopup(); });
        overlay();
    });

    if ($('body.lista-gerenciar').length > 0) {
        //Cria Variavel para percorrer as linhas de uma tabela
        var rows = $('.giftlist-table tr');
        //Reordena o header
        var th;
        rows.each(function() {
            th = $(this).find('th');
            th.eq(0).insertAfter(th.eq(2));
        });

        //Reordena as coolunas
        var td;
        rows.each(function() {
            td = $(this).find('td');
            td.eq(6).insertBefore(td.eq(0));
        });

        var url;
        $('.giftlist-body-action-sendfriend a').each(function() {
            url = $(this).attr('href') + "&amp;width=371&amp;height=236";
            $(this).attr('href', url).attr('title', 'Enviar para amigos');
        });
    }

    //Ajustar tabela
    //$('.listas .giftlist-body-name').insertBefore('.listas .giftlist-body-action');


});


//Frete
var openPaymentMethod = {
    init: function() {
        //Abrir Popup
        var sku = $('#calculoFrete').attr('skuCorrente');
        var url = '/Site/OutrasFormasPagamento.aspx?IdSku=' + sku;

        $('.openProductPayment').click(function(e) {
            overlay();
            $('<div class="productPayment"></div>').appendTo('body').fadeIn(400);
            $('<iframe class="productPaymentIframe" src="' + url + '" width="294" height="370" frameborder="0"></iframe>').appendTo('.productPayment');
            $('<h3 class="ttlOpcoes">OpÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµes de parcelamento</h3>').appendTo('.productPayment');
            $('<a href="#" class="fechar">Fechar</a>').appendTo('.productPayment').click(function() { $(this).fadeOut(); hidePopup(); });
            e.preventDefault();
        });


    }
};

//Plano de fundo do Popup
function overlay() {
    $('<div class="overlay"></div>')
    .css({
        'opacity': '0.0',
        'background': '#000',
        'position': 'fixed',
        'width': '100%',
        'height': '100%',
        'top': '0',
        'left': '0',
        'z-index': '99'
    })
    .appendTo('body')
    .animate({ 'opacity': '0.4' }, 800)
    .click(function() { hidePopup(); });
}

//Esconder Popup

function hidePopup() {
    $('.calcFrete .fechar').remove();
    $('.productPayment, #calculoFrete').fadeOut(500);
    $('.productPayment').remove();
    $('.paymentCalcEnt .fechar').hide();
    $('.overlay').fadeOut(500, function() { $(this).remove(); });
}

function hideMenuSubItems(o) {
    o.css('left', '-999em').fadeOut(10);
}

//FAQ
$(".faqCategoria").live("click", function() {
    $(".faqCategoria").removeClass("open");
    $(".faq dl:visible").slideUp();
    if ($(this).parent().children("dl").css("display") == "none") {
        $(this).addClass("open");
        $(this).parent().children("dl").slideDown();
    }
    else {
        $(this).removeClass("open");
    }
});
$(".faqPergunta").live("click", function() {
    $(".faqResposta:visible").prev().children("a").removeClass("active open");
    $(".faqResposta:visible").slideUp();
    if ($(this).parent().next().css("display") == "none") {
        $(this).addClass("active open");
        $(this).parent().next().slideDown();
    }
    else {
        $(this).removeClass("open");
    }
});

//Fale Conosco
var openEmailMsg = {
    init: function() {
        //Abrir Popup
        var urlmsg = '/Site/FaleConosco.aspx';

        $('.enviaEmail').click(function(e) {
            overlay();
            $('<div class="productPayment"></div>').appendTo('body').fadeIn(400);
            $('<iframe class="productPaymentIframe" src="' + urlmsg + '" width="345" height="410" frameborder="0"></iframe>').appendTo('.productPayment');
            $('<h3 class="ttlOpcoes">OpÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµes de parcelamento</h3>').appendTo('.productPayment');
            $('<a href="#" class="fecharMsg">Fechar</a>').appendTo('.productPayment').click(function() { $(this).fadeOut(); hidePopup(); });
            e.preventDefault();
        });
    }
};
//Indique a um amigo
var popReferAFriend = {
    init: function() {
        $('#dvReferAFriend').append('<input id="btReferAFriend" value="Indique a um amigo" type="button" class="thickbox" onclick="tb_show(\'Indique a  um amigo\', \'/referAFriend/Form/' + parseInt($('#calculoFrete').attr('produtoCorrente')) + '?KeepThis=true&amp;width=371&amp;height=236\', false)" />');
    }
};

//Target busca frete
$(document).ajaxStop(function() {
    //Pagina produtos frete
    if ($(".cep-busca").length > 0) {
        $(".cep-busca").html("<a href=\"http://www.buscacep.correios.com.br/servicos/dnec/menuAction.do?Metodo=menuLogradouro\" class=\"bt lnkExterno\" title=\"NÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o sei meu CEP\" target=\"_blank\">NÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o sei meu CEP</a></span>");
    }
    //Fecha popup
    $('#lnkFechar1').click(function() {
        $('.overlay').css('display', 'none');
    })

    //Adiciona classe
    $('#btReferAFriend').click(function() {
        $('#TB_title').addClass('popIndiqueamigo');
    })
    quickview();
});
var listAddressError = {
    init: function() {
        if ($('.address-list-select li.incomplete').length > 0 && $('.address-list-select li.incomplete label:first').attr('for') == 'giftlistaddress') {
            $('#listAddressError').append($('.address-list-select li.incomplete label:first'))
            $('#listAddressError').append($('.address-list-select li.incomplete input:last'));
            $('#listAddressError').fadeIn();
        }
    }
};

$(window).load(function() {
    if ($("body").hasClass("produto") && ($('input.skuespec_Tamanho_opcao_unico').length > 0 || $('input.skuespec_Cor_opcao_unico').length > 0 || $('input.skuespec_Cor_opcao_unica').length > 0 || $('input.skuespec_Volume_opcao_unico').length > 0 || $('input.skuespec_Peso_opcao_unico').length > 0 || $('input.skuespec_Capacidade_opcao_unico').length > 0)) {
        $('input.skuespec_Tamanho_opcao_unico, input.skuespec_Cor_opcao_unico, input.skuespec_Cor_opcao_unica, input.skuespec_Volume_opcao_unico, input.skuespec_Peso_opcao_unico, input.skuespec_Capacidade_opcao_unico').attr('checked', true);
        $('input.skuespec_Tamanho_opcao_unico, input.skuespec_Cor_opcao_unico, input.skuespec_Cor_opcao_unica, input.skuespec_Volume_opcao_unico, input.skuespec_Peso_opcao_unico, input.skuespec_Capacidade_opcao_unico').parent().parent().parent().hide();
    }
});

var obj =
{
    init: function() {
        $("#facebook").append('\
            <div id="fb-root"></div>\
            <html xmlns:fb="http://ogp.me/ns/fb#">\
            <fb:fan profile_id="141007029281338" width="179" height="450" show_faces="true" stream="false" header="false" css=""></fb:fan>\
        ');

        var fbFunction = function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/pt_BR/all.js#xfbml=1&appId=";
            fjs.parentNode.insertBefore(js, fjs);
        }
        fbFunction(document, 'script', 'facebook-jssdk');
    }
};
$(obj.init);

var loja = {
    init: function(){
        var b = $('body');
        loja.menu2Ul(b);
        loja.ajustmenu();
        loja.popupFrete(b);
        
    },
    ajaxStop: function(){
        
    },
    menu2Ul:function(b)
    {
        
        var m=b.find(".departamentosNovo .menu-departamento"),
            ul=$("<ul class='menu2Ul'></ul>"),
            i=0;

        m.find(">h3").each(function(){
            var $t=$(this),
                li=$("<li class='ind"+i+"'><div class='menuHorizOverflow3'></div></li>"),
                subMenu=$t.find("+ul"),
                div=$("<div class='menu2UlWrap'></div>"),
                wrap=$('<div class="menu2UlWrap2"><div class="shelfInMenu vtexsm-product"></div></div>');
            
            subMenu.prependTo(wrap);
            wrap.appendTo(div);
            div.appendTo(li);
            $t.prependTo(li);
            li.appendTo(ul);
            i++;
        });

        ul.appendTo(m);
        ul.find(">li:last").addClass("last");
        
        loja.subMenuPosition(ul,b);
    },
    subMenuPosition:function(ul,b)
    {
        var wrap,$t,subMenu,pos;

        wrap=b.find(".departamentosNovo").css("position","relative");
        ul.find(">li").each(function(){
            $t=$(this);
            subMenu=$t.find(".menu2UlWrap");
            pos=(wrap.width()-($t.position().left+subMenu.css("visibility","visible").outerWidth(true)));
            subMenu.removeAttr("style");
            if(pos<0)
                subMenu.css("left",(pos));
        });
    },
    
    ajustmenu: function()
    {
        $('.todosDepartamentosNovo h3').each(function(){
            var ul = $(this).next('ul');
            var li = $('<li />');

            $(this).appendTo(li);
            li.prependTo(ul);
        });
    },
    popupFrete: function(b)
    {
        $('.btRegrasFrete').bind("click", function() {
           b.find(".infFreteTop").clone().vtexPopUp2({"popupType":"freecontent", popupClass:"contTelevendas"}).show();
           return false;
        });
        
        $('.btRegrasDesconto').bind("click", function() {
           b.find(".infDescontoTop").clone().vtexPopUp2({"popupType":"freecontent", popupClass:"contTelevendas"}).show();
           return false;
        }); 
    }
}; //Fecha loja

$(loja.init);
$(document).ajaxStop(loja.ajaxStop);
