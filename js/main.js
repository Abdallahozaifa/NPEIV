/*global $*/

// TODO
$(document).ready(function() {
    $('#paypal_icon').click(function(){
        window.open('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CWE3TEDKPFDYU', '_blank');
    });

    // Get Navigation Bar
    $.get('/get/navigation/main', function(data) {
        $('#navigator_holder').html(data);
        reinstanceNav();
        if (sessionStorage.getItem('username')) {
            getMemberNav();

        }
    });

    var searchBar = $(".searchBar");
    console.log(searchBar);
    if (searchBar != null) {
        if (typeof searchBar.on == 'function') {
            searchBar.on('keypress', function(e) {
                if (e.which === 13) {
                    e.preventDefault();

                    var searchTxt = searchBar.val();
                    searchBar.val("");

                    //console.log(searchTxt);
                    var listOfFiles =
                        $.ajax({
                            url: "/search",
                            type: "POST",
                            data: JSON.stringify({
                                searchWord: searchTxt
                            }),
                            contentType: "application/json",
                            dataType: 'json'
                        }).promise();
                    listOfFiles.done(function(data) {
                        //console.log(data);
                        var pages = "";
                        if (data.length == 0) {
                            swal({
                                title: 'No Results!',
                                text: 'Your search returned no results!',
                                type: 'error',
                                confirmButtonText: 'OK'
                            });
                        }
                        else {
                            var pgCount = 1;
                            data.forEach(function(file) {
                                //console.log(file.lastIndexOf("."));
                                var fileName = file.substr(file.lastIndexOf('/') + 1);
                                var link = "/" + file.substring(file.indexOf("pub"));
                                link = link.substr(0, link.lastIndexOf('.'));
                                //console.log(link);
                                fileName = fileName.substr(0, fileName.lastIndexOf('.'));
                                //console.log(fileName);
                                pages += createLinkHTML(link, pgCount, fileName);
                                pgCount++;
                            });
                            swal({
                                title: '<i>Your results returned</i>',
                                type: 'success',
                                html: pages,
                                showCloseButton: true,
                                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
                            })
                        }
                    });

                }
            });
        }
    }

    var submitBtn = $("#submitBtn");
    if (submitBtn != null) {
        submitBtn.click(function(e) {
            e.preventDefault();
            console.log("Submit!");
            var subject = $("#subject");
            var descr = $("#description");
            var itemsChosen = actionTeamParseOUT();
            $('#action_team0').prop('checked', false);
            $('#action_team1').prop('checked', false);
            $('#action_team2').prop('checked', false);
            $('#action_team3').prop('checked', false);
            $('#action_team4').prop('checked', false);
            $('#action_team5').prop('checked', false);
            $('#action_team6').prop('checked', false);
            $('#action_team7').prop('checked', false);
            console.log(itemsChosen);

            var data = {
                username: sessionStorage.getItem("username"),
                tempkey: sessionStorage.getItem("guid"),
                actionTeams: itemsChosen,
                subject: subject.val(),
                message: descr.val()
            };
            subject.val("");
            descr.val("");
            console.log(data);
            $.ajax({
                url: "/msg/send",
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: 'json',
                success: function(res) {
                    console.log(res);
                    if (res.Result == "OK") {
                        swal('Success!', 'Your message was successfully sent!', 'success');
                    }
                    else {
                        swal({
                            title: 'Error!',
                            text: 'Your message was not successfully sent!',
                            type: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                }
            });
        });
    }

});

var createLinkHTML = function(href, pageNum, text) {
    return '<a' + ' target="_blank" href= " ' + href + ' "> ' + pageNum + ". " + text + '</a><br>'
};

function UserLogin() {
    $.post("/post/login?username=" + $('#user_name').val() + "&password=" + $('#pswd').val(), function(data) {
        //console.log(data);
        data = JSON.parse(data);
        console.log(data);
        // If loging was a success
        if (data.Result == "OK") {
            var usrName = $('#user_name').val();

            // Store the users temp data into sessionStorage
            sessionStorage.setItem("username", usrName);
            sessionStorage.setItem("guid", data.key);
            sessionStorage.setItem("loginTTL", data.ttl);
            sessionStorage.setItem("lvl", data.lvl || 1);
            // Redirect to user page 
            window.location.href = "/member/user";
        }
        else {
            //console.log(data.Result + data.Message); // Display login failure
            /*console.log(
                'Oops...',
                'Username and Password do NOT match!',
                'error'
            )*/

            swal({
                title: 'Oops...',
                text: data.Message,
                type: 'error'
            });

        }

    });
}

function actionTeamParseIN(actionTeams) {
    for (var i = 0; i < actionTeams.length; i++) {
        if (actionTeams[i] == 0) {
            $('#action_team0').prop('checked', true);
        }
        if (actionTeams[i] == 1) {
            $('#action_team1').prop('checked', true);
        }
        if (actionTeams[i] == 2) {
            $('#action_team2').prop('checked', true);
        }
        if (actionTeams[i] == 3) {
            $('#action_team3').prop('checked', true);
        }
        if (actionTeams[i] == 4) {
            $('#action_team4').prop('checked', true);
        }
        if (actionTeams[i] == 5) {
            $('#action_team5').prop('checked', true);
        }
        if (actionTeams[i] == 6) {
            $('#action_team6').prop('checked', true);
        }
        if (actionTeams[i] == 7) {
            $('#action_team7').prop('checked', true);
        }
    }

}

function actionTeamParseOUT() {
    var actionTeams = [];
    if ($('#action_team0').prop('checked')) {
        actionTeams.push(0);
    }
    if ($('#action_team1').prop('checked')) {
        actionTeams.push(1);
    }
    if ($('#action_team2').prop('checked')) {
        actionTeams.push(2);
    }
    if ($('#action_team3').prop('checked')) {
        actionTeams.push(3);
    }
    if ($('#action_team4').prop('checked')) {
        actionTeams.push(4);
    }
    if ($('#action_team5').prop('checked')) {
        actionTeams.push(5);
    }
    if ($('#action_team6').prop('checked')) {
        actionTeams.push(6);
    }
    if ($('#action_team7').prop('checked')) {
        actionTeams.push(7);
    }
    return actionTeams;
}

// Resets the onClick listeners for the navigation accordian
function reinstanceNav() {
    $('.pageGroup-name').unbind('click');
    $('.pageGroup-name').click(function(e) {
        e.preventDefault();

        var $this = $(this);

        if ($this.next().hasClass('show-nav-element')) {
            $this.next().removeClass('show-nav-element');
            $this.next().slideUp(100);
        }
        else {
            //$this.parent().parent().find('li .pageGroup-children').removeClass('show-navbuild');
            //$this.parent().parent().find('li .pageGroup-children').slideUp(100);
            $this.next().toggleClass('show-nav-element');
            $this.next().slideToggle(100);
        }
    });

    if (Number(sessionStorage.getItem("loginTTL")) > Date.now()) {
        $('#login567').children('a').html('My Account');
    }
}

//
function toggleNavigator() {
    $('#navigator_holder').toggleClass('navigator_holder--hidden');
}

function getMemberNav() {
    $.get('/get/navigation/member', function(data) {
        $('#nav-root').append(data);
        reinstanceNav();
        getAdminNav();
    });
}

function getAdminNav() {
    if (sessionStorage.getItem("lvl") >= 3) {
        $.get('/get/navigation/admin', function(data) {
            $('#nav-root').append(data);
            reinstanceNav();
        });
    }

}


function loadEditor() {
    $.get('/admin/editor', function(data) {
        $('body').append(data);
        console.log();
    });
}

// Dynamicaly load javascript form server
function loadScript(path, callback) {
    $.getScript(path, function(data) {
        callback(data);
    });
}


function search_bar() {

    var a = document.getElementById('f_search_bar');
    a.addEventListener('submit', function(e) {
        e.preventDefault();
        var b = document.getElementById('searchBar').value;
        window.location.href = 'https://npeiv-webapp-abdallahozaifa.c9users.io/#q=' + b + "&*";
    });

}

! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Sweetalert2 = t()
}(this, function() {
    "use strict";
    var e = {
            title: "",
            titleText: "",
            text: "",
            html: "",
            type: null,
            customClass: "",
            target: "body",
            animation: !0,
            allowOutsideClick: !0,
            allowEscapeKey: !0,
            allowEnterKey: !0,
            showConfirmButton: !0,
            showCancelButton: !1,
            preConfirm: null,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
            confirmButtonClass: null,
            cancelButtonText: "Cancel",
            cancelButtonColor: "#aaa",
            cancelButtonClass: null,
            buttonsStyling: !0,
            reverseButtons: !1,
            focusCancel: !1,
            showCloseButton: !1,
            showLoaderOnConfirm: !1,
            imageUrl: null,
            imageWidth: null,
            imageHeight: null,
            imageClass: null,
            timer: null,
            width: 500,
            padding: 20,
            background: "#fff",
            input: null,
            inputPlaceholder: "",
            inputValue: "",
            inputOptions: {},
            inputAutoTrim: !0,
            inputClass: null,
            inputAttributes: {},
            inputValidator: null,
            progressSteps: [],
            currentProgressStep: null,
            progressStepsDistance: "40px",
            onOpen: null,
            onClose: null
        },
        t = function(e) {
            var t = {};
            for (var n in e) t[e[n]] = "swal2-" + e[n];
            return t
        },
        n = t(["container", "shown", "iosfix", "modal", "overlay", "fade", "show", "hide", "noanimation", "close", "title", "content", "buttonswrapper", "confirm", "cancel", "icon", "image", "input", "file", "range", "select", "radio", "checkbox", "textarea", "inputerror", "validationerror", "progresssteps", "activeprogressstep", "progresscircle", "progressline", "loading", "styled"]),
        o = t(["success", "warning", "info", "question", "error"]),
        r = function(e, t) {
            e = String(e).replace(/[^0-9a-f]/gi, ""), e.length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), t = t || 0;
            for (var n = "#", o = 0; o < 3; o++) {
                var r = parseInt(e.substr(2 * o, 2), 16);
                r = Math.round(Math.min(Math.max(0, r + r * t), 255)).toString(16), n += ("00" + r).substr(r.length)
            }
            return n
        },
        i = function(e) {
            var t = [];
            for (var n in e) t.indexOf(e[n]) === -1 && t.push(e[n]);
            return t
        },
        a = {
            previousWindowKeyDown: null,
            previousActiveElement: null,
            previousBodyPadding: null
        },
        l = function(e) {
            if ("undefined" == typeof document) return void console.error("SweetAlert2 requires document to initialize");
            var t = document.createElement("div");
            t.className = n.container, t.innerHTML = s;
            var o = document.querySelector(e.target);
            o || (console.warn("SweetAlert2: Can't find the target \"" + e.target + '"'), o = document.body), o.appendChild(t);
            var r = c(),
                i = A(r, n.input),
                a = A(r, n.file),
                l = r.querySelector("." + n.range + " input"),
                u = r.querySelector("." + n.range + " output"),
                d = A(r, n.select),
                p = r.querySelector("." + n.checkbox + " input"),
                f = A(r, n.textarea);
            return i.oninput = function() {
                J.resetValidationError()
            }, i.onkeydown = function(t) {
                setTimeout(function() {
                    13 === t.keyCode && e.allowEnterKey && (t.stopPropagation(), J.clickConfirm())
                }, 0)
            }, a.onchange = function() {
                J.resetValidationError()
            }, l.oninput = function() {
                J.resetValidationError(), u.value = l.value
            }, l.onchange = function() {
                J.resetValidationError(), l.previousSibling.value = l.value
            }, d.onchange = function() {
                J.resetValidationError()
            }, p.onchange = function() {
                J.resetValidationError()
            }, f.oninput = function() {
                J.resetValidationError()
            }, r
        },
        s = ('\n <div role="dialog" aria-labelledby="' + n.title + '" aria-describedby="' + n.content + '" class="' + n.modal + '" tabindex="-1">\n   <ul class="' + n.progresssteps + '"></ul>\n   <div class="' + n.icon + " " + o.error + '">\n     <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span>\n   </div>\n   <div class="' + n.icon + " " + o.question + '">?</div>\n   <div class="' + n.icon + " " + o.warning + '">!</div>\n   <div class="' + n.icon + " " + o.info + '">i</div>\n   <div class="' + n.icon + " " + o.success + '">\n     <div class="swal2-success-circular-line-left"></div>\n     <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n     <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n     <div class="swal2-success-circular-line-right"></div>\n   </div>\n   <img class="' + n.image + '">\n   <h2 class="' + n.title + '" id="' + n.title + '"></h2>\n   <div id="' + n.content + '" class="' + n.content + '"></div>\n   <input class="' + n.input + '">\n   <input type="file" class="' + n.file + '">\n   <div class="' + n.range + '">\n     <output></output>\n     <input type="range">\n   </div>\n   <select class="' + n.select + '"></select>\n   <div class="' + n.radio + '"></div>\n   <label for="' + n.checkbox + '" class="' + n.checkbox + '">\n     <input type="checkbox">\n   </label>\n   <textarea class="' + n.textarea + '"></textarea>\n   <div class="' + n.validationerror + '"></div>\n   <div class="' + n.buttonswrapper + '">\n     <button type="button" class="' + n.confirm + '">OK</button>\n     <button type="button" class="' + n.cancel + '">Cancel</button>\n   </div>\n   <button type="button" class="' + n.close + '" aria-label="Close this dialog">&times;</button>\n </div>\n').replace(/(^|\n)\s*/g, ""),
        u = function() {
            return document.body.querySelector("." + n.container)
        },
        c = function() {
            return u() ? u().querySelector("." + n.modal) : null
        },
        d = function() {
            return c().querySelectorAll("." + n.icon)
        },
        p = function(e) {
            return u() ? u().querySelector("." + e) : null
        },
        f = function() {
            return p(n.title)
        },
        m = function() {
            return p(n.content)
        },
        v = function() {
            return p(n.image)
        },
        h = function() {
            return p(n.buttonswrapper)
        },
        g = function() {
            return p(n.progresssteps)
        },
        y = function() {
            return p(n.validationerror)
        },
        b = function() {
            return p(n.confirm)
        },
        w = function() {
            return p(n.cancel)
        },
        C = function() {
            return p(n.close)
        },
        k = function(e) {
            var t = [b(), w()];
            e && t.reverse();
            var n = t.concat(Array.prototype.slice.call(c().querySelectorAll('button, input:not([type=hidden]), textarea, select, a, *[tabindex]:not([tabindex="-1"])')));
            return i(n)
        },
        x = function(e, t) {
            return !!e.classList && e.classList.contains(t)
        },
        S = function(e) {
            if (e.focus(), "file" !== e.type) {
                var t = e.value;
                e.value = "", e.value = t
            }
        },
        E = function(e, t) {
            if (e && t) {
                t.split(/\s+/).filter(Boolean).forEach(function(t) {
                    e.classList.add(t)
                })
            }
        },
        B = function(e, t) {
            if (e && t) {
                t.split(/\s+/).filter(Boolean).forEach(function(t) {
                    e.classList.remove(t)
                })
            }
        },
        A = function(e, t) {
            for (var n = 0; n < e.childNodes.length; n++)
                if (x(e.childNodes[n], t)) return e.childNodes[n]
        },
        P = function(e, t) {
            t || (t = "block"), e.style.opacity = "", e.style.display = t
        },
        T = function(e) {
            e.style.opacity = "", e.style.display = "none"
        },
        L = function(e) {
            for (; e.firstChild;) e.removeChild(e.firstChild)
        },
        M = function(e) {
            return e.offsetWidth || e.offsetHeight || e.getClientRects().length
        },
        q = function(e, t) {
            e.style.removeProperty ? e.style.removeProperty(t) : e.style.removeAttribute(t)
        },
        V = function(e) {
            if (!M(e)) return !1;
            if ("function" == typeof MouseEvent) {
                var t = new MouseEvent("click", {
                    view: window,
                    bubbles: !1,
                    cancelable: !0
                });
                e.dispatchEvent(t)
            }
            else if (document.createEvent) {
                var n = document.createEvent("MouseEvents");
                n.initEvent("click", !1, !1), e.dispatchEvent(n)
            }
            else document.createEventObject ? e.fireEvent("onclick") : "function" == typeof e.onclick && e.onclick()
        },
        O = function() {
            var e = document.createElement("div"),
                t = {
                    WebkitAnimation: "webkitAnimationEnd",
                    OAnimation: "oAnimationEnd oanimationend",
                    msAnimation: "MSAnimationEnd",
                    animation: "animationend"
                };
            for (var n in t)
                if (t.hasOwnProperty(n) && void 0 !== e.style[n]) return t[n];
            return !1
        }(),
        H = function() {
            if (window.onkeydown = a.previousWindowKeyDown, a.previousActiveElement && a.previousActiveElement.focus) {
                var e = window.scrollX,
                    t = window.scrollY;
                a.previousActiveElement.focus(), e && t && window.scrollTo(e, t)
            }
        },
        N = function() {
            if ("ontouchstart" in window || navigator.msMaxTouchPoints) return 0;
            var e = document.createElement("div");
            e.style.width = "50px", e.style.height = "50px", e.style.overflow = "scroll", document.body.appendChild(e);
            var t = e.offsetWidth - e.clientWidth;
            return document.body.removeChild(e), t
        },
        I = function(e, t) {
            var n = void 0;
            return function() {
                var o = function() {
                    n = null, e()
                };
                clearTimeout(n), n = setTimeout(o, t)
            }
        },
        j = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        },
        K = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o])
            }
            return e
        },
        D = K({}, e),
        W = [],
        U = void 0,
        R = function(t) {
            var r = c() || l(t);
            for (var i in t) e.hasOwnProperty(i) || "extraParams" === i || console.warn('SweetAlert2: Unknown parameter "' + i + '"');
            r.style.width = "number" == typeof t.width ? t.width + "px" : t.width, r.style.padding = t.padding + "px", r.style.background = t.background;
            for (var a = r.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix"), s = 0; s < a.length; s++) a[s].style.background = t.background;
            var u = f(),
                p = m(),
                y = h(),
                k = b(),
                x = w(),
                S = C();
            if (t.titleText ? u.innerText = t.titleText : u.innerHTML = t.title.split("\n").join("<br>"), t.text || t.html) {
                if ("object" === j(t.html))
                    if (p.innerHTML = "", 0 in t.html)
                        for (var A = 0; A in t.html; A++) p.appendChild(t.html[A].cloneNode(!0));
                    else p.appendChild(t.html.cloneNode(!0));
                else t.html ? p.innerHTML = t.html : t.text && (p.textContent = t.text);
                P(p)
            }
            else T(p);
            t.showCloseButton ? P(S) : T(S), r.className = n.modal, t.customClass && E(r, t.customClass);
            var M = g(),
                V = parseInt(null === t.currentProgressStep ? J.getQueueStep() : t.currentProgressStep, 10);
            t.progressSteps.length ? (P(M), L(M), V >= t.progressSteps.length && console.warn("SweetAlert2: Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"), t.progressSteps.forEach(function(e, o) {
                var r = document.createElement("li");
                if (E(r, n.progresscircle), r.innerHTML = e, o === V && E(r, n.activeprogressstep), M.appendChild(r), o !== t.progressSteps.length - 1) {
                    var i = document.createElement("li");
                    E(i, n.progressline), i.style.width = t.progressStepsDistance, M.appendChild(i)
                }
            })) : T(M);
            for (var O = d(), H = 0; H < O.length; H++) T(O[H]);
            if (t.type) {
                var N = !1;
                for (var I in o)
                    if (t.type === I) {
                        N = !0;
                        break
                    }
                if (!N) return console.error("SweetAlert2: Unknown alert type: " + t.type), !1;
                var K = r.querySelector("." + n.icon + "." + o[t.type]);
                if (P(K), t.animation) switch (t.type) {
                    case "success":
                        E(K, "swal2-animate-success-icon"), E(K.querySelector(".swal2-success-line-tip"), "swal2-animate-success-line-tip"), E(K.querySelector(".swal2-success-line-long"), "swal2-animate-success-line-long");
                        break;
                    case "error":
                        E(K, "swal2-animate-error-icon"), E(K.querySelector(".swal2-x-mark"), "swal2-animate-x-mark")
                }
            }
            var D = v();
            t.imageUrl ? (D.setAttribute("src", t.imageUrl), P(D), t.imageWidth ? D.setAttribute("width", t.imageWidth) : D.removeAttribute("width"), t.imageHeight ? D.setAttribute("height", t.imageHeight) : D.removeAttribute("height"), D.className = n.image, t.imageClass && E(D, t.imageClass)) : T(D), t.showCancelButton ? x.style.display = "inline-block" : T(x), t.showConfirmButton ? q(k, "display") : T(k), t.showConfirmButton || t.showCancelButton ? P(y) : T(y), k.innerHTML = t.confirmButtonText, x.innerHTML = t.cancelButtonText, t.buttonsStyling && (k.style.backgroundColor = t.confirmButtonColor, x.style.backgroundColor = t.cancelButtonColor), k.className = n.confirm, E(k, t.confirmButtonClass), x.className = n.cancel, E(x, t.cancelButtonClass), t.buttonsStyling ? (E(k, n.styled), E(x, n.styled)) : (B(k, n.styled), B(x, n.styled), k.style.backgroundColor = k.style.borderLeftColor = k.style.borderRightColor = "", x.style.backgroundColor = x.style.borderLeftColor = x.style.borderRightColor = ""), t.animation === !0 ? B(r, n.noanimation) : E(r, n.noanimation)
        },
        z = function(e, t) {
            var o = u(),
                r = c();
            e ? (E(r, n.show), E(o, n.fade), B(r, n.hide)) : B(r, n.fade), P(r), o.style.overflowY = "hidden", O && !x(r, n.noanimation) ? r.addEventListener(O, function e() {
                r.removeEventListener(O, e), o.style.overflowY = "auto"
            }) : o.style.overflowY = "auto", E(document.documentElement, n.shown), E(document.body, n.shown), E(o, n.shown), Q(), Z(), a.previousActiveElement = document.activeElement, null !== t && "function" == typeof t && setTimeout(function() {
                t(r)
            })
        },
        Q = function() {
            null === a.previousBodyPadding && document.body.scrollHeight > window.innerHeight && (a.previousBodyPadding = document.body.style.paddingRight, document.body.style.paddingRight = N() + "px")
        },
        Y = function() {
            null !== a.previousBodyPadding && (document.body.style.paddingRight = a.previousBodyPadding, a.previousBodyPadding = null)
        },
        Z = function() {
            if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && !x(document.body, n.iosfix)) {
                var e = document.body.scrollTop;
                document.body.style.top = e * -1 + "px", E(document.body, n.iosfix)
            }
        },
        $ = function() {
            if (x(document.body, n.iosfix)) {
                var e = parseInt(document.body.style.top, 10);
                B(document.body, n.iosfix), document.body.style.top = "", document.body.scrollTop = e * -1
            }
        },
        J = function e() {
            for (var t = arguments.length, o = Array(t), i = 0; i < t; i++) o[i] = arguments[i];
            if (void 0 === o[0]) return console.error("SweetAlert2 expects at least 1 attribute!"), !1;
            var l = K({}, D);
            switch (j(o[0])) {
                case "string":
                    l.title = o[0], l.html = o[1], l.type = o[2];
                    break;
                case "object":
                    K(l, o[0]), l.extraParams = o[0].extraParams, "email" === l.input && null === l.inputValidator && (l.inputValidator = function(e) {
                        return new Promise(function(t, n) {
                            /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(e) ? t() : n("Invalid email address")
                        })
                    }), "url" === l.input && null === l.inputValidator && (l.inputValidator = function(e) {
                        return new Promise(function(t, n) {
                            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(e) ? t() : n("Invalid URL")
                        })
                    });
                    break;
                default:
                    return console.error('SweetAlert2: Unexpected type of argument! Expected "string" or "object", got ' + j(o[0])), !1
            }
            R(l);
            var s = u(),
                d = c();
            return new Promise(function(t, o) {
                l.timer && (d.timeout = setTimeout(function() {
                    e.closeModal(l.onClose), o("timer")
                }, l.timer));
                var i = function(e) {
                        if (!(e = e || l.input)) return null;
                        switch (e) {
                            case "select":
                            case "textarea":
                            case "file":
                                return A(d, n[e]);
                            case "checkbox":
                                return d.querySelector("." + n.checkbox + " input");
                            case "radio":
                                return d.querySelector("." + n.radio + " input:checked") || d.querySelector("." + n.radio + " input:first-child");
                            case "range":
                                return d.querySelector("." + n.range + " input");
                            default:
                                return A(d, n.input)
                        }
                    },
                    p = function() {
                        var e = i();
                        if (!e) return null;
                        switch (l.input) {
                            case "checkbox":
                                return e.checked ? 1 : 0;
                            case "radio":
                                return e.checked ? e.value : null;
                            case "file":
                                return e.files.length ? e.files[0] : null;
                            default:
                                return l.inputAutoTrim ? e.value.trim() : e.value
                        }
                    };
                l.input && setTimeout(function() {
                    var e = i();
                    e && S(e)
                }, 0);
                for (var x = function(n) {
                        l.showLoaderOnConfirm && e.showLoading(), l.preConfirm ? l.preConfirm(n, l.extraParams).then(function(o) {
                            e.closeModal(l.onClose), t(o || n)
                        }, function(t) {
                            e.hideLoading(), t && e.showValidationError(t)
                        }) : (e.closeModal(l.onClose), t(n))
                    }, L = function(t) {
                        var n = t || window.event,
                            i = n.target || n.srcElement,
                            a = b(),
                            s = w(),
                            u = a && (a === i || a.contains(i)),
                            c = s && (s === i || s.contains(i));
                        switch (n.type) {
                            case "mouseover":
                            case "mouseup":
                                l.buttonsStyling && (u ? a.style.backgroundColor = r(l.confirmButtonColor, -.1) : c && (s.style.backgroundColor = r(l.cancelButtonColor, -.1)));
                                break;
                            case "mouseout":
                                l.buttonsStyling && (u ? a.style.backgroundColor = l.confirmButtonColor : c && (s.style.backgroundColor = l.cancelButtonColor));
                                break;
                            case "mousedown":
                                l.buttonsStyling && (u ? a.style.backgroundColor = r(l.confirmButtonColor, -.2) : c && (s.style.backgroundColor = r(l.cancelButtonColor, -.2)));
                                break;
                            case "click":
                                if (u && e.isVisible())
                                    if (e.disableButtons(), l.input) {
                                        var d = p();
                                        l.inputValidator ? (e.disableInput(), l.inputValidator(d, l.extraParams).then(function() {
                                            e.enableButtons(), e.enableInput(), x(d)
                                        }, function(t) {
                                            e.enableButtons(), e.enableInput(), t && e.showValidationError(t)
                                        })) : x(d)
                                    }
                                    else x(!0);
                                else c && e.isVisible() && (e.disableButtons(), e.closeModal(l.onClose), o("cancel"))
                        }
                    }, q = d.querySelectorAll("button"), O = 0; O < q.length; O++) q[O].onclick = L, q[O].onmouseover = L, q[O].onmouseout = L, q[O].onmousedown = L;
                C().onclick = function() {
                    e.closeModal(l.onClose), o("close")
                }, s.onclick = function(t) {
                    t.target === s && l.allowOutsideClick && (e.closeModal(l.onClose), o("overlay"))
                };
                var H = h(),
                    N = b(),
                    K = w();
                l.reverseButtons ? N.parentNode.insertBefore(K, N) : N.parentNode.insertBefore(N, K);
                var D = function(e, t) {
                        for (var n = k(l.focusCancel), o = 0; o < n.length; o++) {
                            e += t, e === n.length ? e = 0 : e === -1 && (e = n.length - 1);
                            var r = n[e];
                            if (M(r)) return r.focus()
                        }
                    },
                    W = function(t) {
                        var n = t || window.event,
                            r = n.keyCode || n.which;
                        if ([9, 13, 32, 27, 37, 38, 39, 40].indexOf(r) !== -1) {
                            for (var i = n.target || n.srcElement, a = k(l.focusCancel), s = -1, u = 0; u < a.length; u++)
                                if (i === a[u]) {
                                    s = u;
                                    break
                                }
                            9 === r ? (n.shiftKey ? D(s, -1) : D(s, 1), n.stopPropagation(), n.preventDefault()) : 37 === r || 38 === r || 39 === r || 40 === r ? document.activeElement === N && M(K) ? K.focus() : document.activeElement === K && M(N) && N.focus() : 13 === r || 32 === r ? s === -1 && l.allowEnterKey && (V(l.focusCancel ? K : N), n.stopPropagation(), n.preventDefault()) : 27 === r && l.allowEscapeKey === !0 && (e.closeModal(l.onClose), o("esc"))
                        }
                    };
                a.previousWindowKeyDown = window.onkeydown, window.onkeydown = W, l.buttonsStyling && (N.style.borderLeftColor = l.confirmButtonColor, N.style.borderRightColor = l.confirmButtonColor), e.showLoading = e.enableLoading = function() {
                    P(H), P(N, "inline-block"), E(H, n.loading), E(d, n.loading), N.disabled = !0, K.disabled = !0
                }, e.hideLoading = e.disableLoading = function() {
                    l.showConfirmButton || (T(N), l.showCancelButton || T(h())), B(H, n.loading), B(d, n.loading), N.disabled = !1, K.disabled = !1
                }, e.getTitle = function() {
                    return f()
                }, e.getContent = function() {
                    return m()
                }, e.getInput = function() {
                    return i()
                }, e.getImage = function() {
                    return v()
                }, e.getButtonsWrapper = function() {
                    return h()
                }, e.getConfirmButton = function() {
                    return b()
                }, e.getCancelButton = function() {
                    return w()
                }, e.enableButtons = function() {
                    N.disabled = !1, K.disabled = !1
                }, e.disableButtons = function() {
                    N.disabled = !0, K.disabled = !0
                }, e.enableConfirmButton = function() {
                    N.disabled = !1
                }, e.disableConfirmButton = function() {
                    N.disabled = !0
                }, e.enableInput = function() {
                    var e = i();
                    if (!e) return !1;
                    if ("radio" === e.type)
                        for (var t = e.parentNode.parentNode, n = t.querySelectorAll("input"), o = 0; o < n.length; o++) n[o].disabled = !1;
                    else e.disabled = !1
                }, e.disableInput = function() {
                    var e = i();
                    if (!e) return !1;
                    if (e && "radio" === e.type)
                        for (var t = e.parentNode.parentNode, n = t.querySelectorAll("input"), o = 0; o < n.length; o++) n[o].disabled = !0;
                    else e.disabled = !0
                }, e.recalculateHeight = I(function() {
                    var e = c();
                    if (e) {
                        var t = e.style.display;
                        e.style.minHeight = "", P(e), e.style.minHeight = e.scrollHeight + 1 + "px", e.style.display = t
                    }
                }, 50), e.showValidationError = function(e) {
                    var t = y();
                    t.innerHTML = e, P(t);
                    var o = i();
                    o && (S(o), E(o, n.inputerror))
                }, e.resetValidationError = function() {
                    var t = y();
                    T(t), e.recalculateHeight();
                    var o = i();
                    o && B(o, n.inputerror)
                }, e.getProgressSteps = function() {
                    return l.progressSteps
                }, e.setProgressSteps = function(e) {
                    l.progressSteps = e, R(l)
                }, e.showProgressSteps = function() {
                    P(g())
                }, e.hideProgressSteps = function() {
                    T(g())
                }, e.enableButtons(), e.hideLoading(), e.resetValidationError();
                for (var Q = ["input", "file", "range", "select", "radio", "checkbox", "textarea"], Y = void 0, Z = 0; Z < Q.length; Z++) {
                    var $ = n[Q[Z]],
                        J = A(d, $);
                    if (Y = i(Q[Z])) {
                        for (var X in Y.attributes)
                            if (Y.attributes.hasOwnProperty(X)) {
                                var _ = Y.attributes[X].name;
                                "type" !== _ && "value" !== _ && Y.removeAttribute(_)
                            }
                        for (var F in l.inputAttributes) Y.setAttribute(F, l.inputAttributes[F])
                    }
                    J.className = $, l.inputClass && E(J, l.inputClass), T(J)
                }
                var G = void 0;
                switch (l.input) {
                    case "text":
                    case "email":
                    case "password":
                    case "number":
                    case "tel":
                    case "url":
                        Y = A(d, n.input), Y.value = l.inputValue, Y.placeholder = l.inputPlaceholder, Y.type = l.input, P(Y);
                        break;
                    case "file":
                        Y = A(d, n.file), Y.placeholder = l.inputPlaceholder, Y.type = l.input, P(Y);
                        break;
                    case "range":
                        var ee = A(d, n.range),
                            te = ee.querySelector("input"),
                            ne = ee.querySelector("output");
                        te.value = l.inputValue, te.type = l.input, ne.value = l.inputValue, P(ee);
                        break;
                    case "select":
                        var oe = A(d, n.select);
                        if (oe.innerHTML = "", l.inputPlaceholder) {
                            var re = document.createElement("option");
                            re.innerHTML = l.inputPlaceholder, re.value = "", re.disabled = !0, re.selected = !0, oe.appendChild(re)
                        }
                        G = function(e) {
                            for (var t in e) {
                                var n = document.createElement("option");
                                n.value = t, n.innerHTML = e[t], l.inputValue === t && (n.selected = !0), oe.appendChild(n)
                            }
                            P(oe), oe.focus()
                        };
                        break;
                    case "radio":
                        var ie = A(d, n.radio);
                        ie.innerHTML = "", G = function(e) {
                            for (var t in e) {
                                var o = document.createElement("input"),
                                    r = document.createElement("label"),
                                    i = document.createElement("span");
                                o.type = "radio", o.name = n.radio, o.value = t, l.inputValue === t && (o.checked = !0), i.innerHTML = e[t], r.appendChild(o), r.appendChild(i), r.for = o.id, ie.appendChild(r)
                            }
                            P(ie);
                            var a = ie.querySelectorAll("input");
                            a.length && a[0].focus()
                        };
                        break;
                    case "checkbox":
                        var ae = A(d, n.checkbox),
                            le = i("checkbox");
                        le.type = "checkbox", le.value = 1, le.id = n.checkbox, le.checked = Boolean(l.inputValue);
                        var se = ae.getElementsByTagName("span");
                        se.length && ae.removeChild(se[0]), se = document.createElement("span"), se.innerHTML = l.inputPlaceholder, ae.appendChild(se), P(ae);
                        break;
                    case "textarea":
                        var ue = A(d, n.textarea);
                        ue.value = l.inputValue, ue.placeholder = l.inputPlaceholder, P(ue);
                        break;
                    case null:
                        break;
                    default:
                        console.error('SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "' + l.input + '"')
                }
                "select" !== l.input && "radio" !== l.input || (l.inputOptions instanceof Promise ? (e.showLoading(), l.inputOptions.then(function(t) {
                    e.hideLoading(), G(t)
                })) : "object" === j(l.inputOptions) ? G(l.inputOptions) : console.error("SweetAlert2: Unexpected type of inputOptions! Expected object or Promise, got " + j(l.inputOptions))), z(l.animation, l.onOpen), l.allowEnterKey ? D(-1, 1) : document.activeElement && document.activeElement.blur(), u().scrollTop = 0, "undefined" == typeof MutationObserver || U || (U = new MutationObserver(e.recalculateHeight), U.observe(d, {
                    childList: !0,
                    characterData: !0,
                    subtree: !0
                }))
            })
        };
    return J.isVisible = function() {
        return !!c()
    }, J.queue = function(e) {
        W = e;
        var t = function() {
                W = [], document.body.removeAttribute("data-swal2-queue-step")
            },
            n = [];
        return new Promise(function(e, o) {
            ! function r(i, a) {
                i < W.length ? (document.body.setAttribute("data-swal2-queue-step", i), J(W[i]).then(function(e) {
                    n.push(e), r(i + 1, a)
                }, function(e) {
                    t(), o(e)
                })) : (t(), e(n))
            }(0)
        })
    }, J.getQueueStep = function() {
        return document.body.getAttribute("data-swal2-queue-step")
    }, J.insertQueueStep = function(e, t) {
        return t && t < W.length ? W.splice(t, 0, e) : W.push(e)
    }, J.deleteQueueStep = function(e) {
        void 0 !== W[e] && W.splice(e, 1)
    }, J.close = J.closeModal = function(e) {
        var t = u(),
            o = c();
        if (o) {
            B(o, n.show), E(o, n.hide), clearTimeout(o.timeout), H();
            var r = function() {
                t.parentNode && t.parentNode.removeChild(t), B(document.documentElement, n.shown), B(document.body, n.shown), Y(), $()
            };
            O && !x(o, n.noanimation) ? o.addEventListener(O, function e() {
                o.removeEventListener(O, e), x(o, n.hide) && r()
            }) : r(), null !== e && "function" == typeof e && setTimeout(function() {
                e(o)
            })
        }
    }, J.clickConfirm = function() {
        return b().click()
    }, J.clickCancel = function() {
        return w().click()
    }, J.setDefaults = function(t) {
        if (!t || "object" !== (void 0 === t ? "undefined" : j(t))) return console.error("SweetAlert2: the argument for setDefaults() is required and has to be a object");
        for (var n in t) e.hasOwnProperty(n) || "extraParams" === n || (console.warn('SweetAlert2: Unknown parameter "' + n + '"'), delete t[n]);
        K(D, t)
    }, J.resetDefaults = function() {
        D = K({}, e)
    }, J.noop = function() {}, J.version = "6.6.1", J.default = J, J
}), window.Sweetalert2 && (window.sweetAlert = window.swal = window.Sweetalert2);
