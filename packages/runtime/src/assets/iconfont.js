!(function (l) {
  var t,
    e,
    o,
    a,
    i,
    n =
      '<svg><symbol id="sc-icon-goods_view" viewBox="0 0 1024 1024"><path d="M768 64 192 64C121.6 64 64 121.6 64 192l0 576c0 70.4 57.6 128 128 128l576 0c70.4 0 128-57.6 128-128L896 192C896 121.6 838.4 64 768 64zM288 704C270.08 704 256 689.92 256 672 256 654.08 270.08 640 288 640 305.92 640 320 654.08 320 672 320 689.92 305.92 704 288 704zM288 512C270.08 512 256 497.92 256 480 256 462.08 270.08 448 288 448 305.92 448 320 462.08 320 480 320 497.92 305.92 512 288 512zM288 320C270.08 320 256 305.92 256 288 256 270.08 270.08 256 288 256 305.92 256 320 270.08 320 288 320 305.92 305.92 320 288 320zM672 704l-256 0C398.08 704 384 689.92 384 672 384 654.08 398.08 640 416 640l256 0c17.92 0 32 14.08 32 32C704 689.92 689.92 704 672 704zM672 512l-256 0C398.08 512 384 497.92 384 480 384 462.08 398.08 448 416 448l256 0C689.92 448 704 462.08 704 480 704 497.92 689.92 512 672 512zM672 320l-256 0C398.08 320 384 305.92 384 288 384 270.08 398.08 256 416 256l256 0C689.92 256 704 270.08 704 288 704 305.92 689.92 320 672 320z" fill="#98999B" ></path></symbol><symbol id="sc-icon-goods_three" viewBox="0 0 1024 1024"><path d="M856 128H692a4 4 0 0 0-4 4v760a4 4 0 0 0 4 4h164a40 40 0 0 0 40-40V168a40 40 0 0 0-40-40z m-524 0H168a40 40 0 0 0-40 40v688a40 40 0 0 0 40 40h164a4 4 0 0 0 4-4V132a4 4 0 0 0-4-4z m280 0H412a4 4 0 0 0-4 4v760a4 4 0 0 0 4 4h200a4 4 0 0 0 4-4V132a4 4 0 0 0-4-4z" fill="#98999B" ></path></symbol><symbol id="sc-icon-goods_list" viewBox="0 0 1024 1024"><path d="M0 102.4m51.2 0l278.016 0q51.2 0 51.2 51.2l0 275.712q0 51.2-51.2 51.2l-278.016 0q-51.2 0-51.2-51.2l0-275.712q0-51.2 51.2-51.2Z" fill="#98999B" ></path><path d="M431.1552 153.6m51.2 0l490.4448 0q51.2 0 51.2 51.2l0 0q0 51.2-51.2 51.2l-490.4448 0q-51.2 0-51.2-51.2l0 0q0-51.2 51.2-51.2Z" fill="#98999B" ></path><path d="M431.1552 342.6304m51.2 0l220.9792 0q51.2 0 51.2 51.2l0 0q0 51.2-51.2 51.2l-220.9792 0q-51.2 0-51.2-51.2l0 0q0-51.2 51.2-51.2Z" fill="#98999B" ></path><path d="M0 543.488m51.2 0l278.016 0q51.2 0 51.2 51.2l0 275.712q0 51.2-51.2 51.2l-278.016 0q-51.2 0-51.2-51.2l0-275.712q0-51.2 51.2-51.2Z" fill="#98999B" ></path><path d="M431.1552 563.2m51.2 0l490.4448 0q51.2 0 51.2 51.2l0 0q0 51.2-51.2 51.2l-490.4448 0q-51.2 0-51.2-51.2l0 0q0-51.2 51.2-51.2Z" fill="#98999B" ></path><path d="M431.1552 716.8m51.2 0l220.9792 0q51.2 0 51.2 51.2l0 0q0 51.2-51.2 51.2l-220.9792 0q-51.2 0-51.2-51.2l0 0q0-51.2 51.2-51.2Z" fill="#98999B" ></path></symbol><symbol id="sc-icon-goods_scroll" viewBox="0 0 1024 1024"><path d="M0 102.4m51.2 0l274.8416 0q51.2 0 51.2 51.2l0 482.7648q0 51.2-51.2 51.2l-274.8416 0q-51.2 0-51.2-51.2l0-482.7648q0-51.2 51.2-51.2Z" fill="#98999B" ></path><path d="M0 804.5568m58.5216 0l165.888 0q58.5216 0 58.5216 58.5216l0 0q0 58.5216-58.5216 58.5216l-165.888 0q-58.5216 0-58.5216-58.5216l0 0q0-58.5216 58.5216-58.5216Z" fill="#98999B" ></path><path d="M431.1552 102.4m51.2 0l274.8416 0q51.2 0 51.2 51.2l0 482.7648q0 51.2-51.2 51.2l-274.8416 0q-51.2 0-51.2-51.2l0-482.7648q0-51.2 51.2-51.2Z" fill="#98999B" ></path><path d="M431.1552 804.5568m58.5216 0l165.888 0q58.5216 0 58.5216 58.5216l0 0q0 58.5216-58.5216 58.5216l-165.888 0q-58.5216 0-58.5216-58.5216l0 0q0-58.5216 58.5216-58.5216Z" fill="#98999B" ></path><path d="M913.5104 102.4H1024v585.1648h-110.4896a51.2 51.2 0 0 1-51.2-51.2V153.6a51.2 51.2 0 0 1 51.2-51.2zM920.832 804.5568H1024V921.6h-103.168a58.5216 58.5216 0 0 1 0-117.0432z" fill="#98999B" ></path></symbol><symbol id="sc-icon-goods_two" viewBox="0 0 1126 1024"><path d="M0 102.4m51.2 0l424.2432 0q51.2 0 51.2 51.2l0 482.7648q0 51.2-51.2 51.2l-424.2432 0q-51.2 0-51.2-51.2l0-482.7648q0-51.2 51.2-51.2Z" fill="#969799" ></path><path d="M585.1648 102.4m51.2 0l424.2432 0q51.2 0 51.2 51.2l0 482.7648q0 51.2-51.2 51.2l-424.2432 0q-51.2 0-51.2-51.2l0-482.7648q0-51.2 51.2-51.2Z" fill="#969799" ></path><path d="M0 804.5568m58.5216 0l234.0352 0q58.5216 0 58.5216 58.5216l0 0q0 58.5216-58.5216 58.5216l-234.0352 0q-58.5216 0-58.5216-58.5216l0 0q0-58.5216 58.5216-58.5216Z" fill="#969799" ></path><path d="M585.1648 804.5568m58.5216 0l234.0352 0q58.5216 0 58.5216 58.5216l0 0q0 58.5216-58.5216 58.5216l-234.0352 0q-58.5216 0-58.5216-58.5216l0 0q0-58.5216 58.5216-58.5216Z" fill="#969799" ></path></symbol></svg>',
    d = (d = document.getElementsByTagName("script"))[
      d.length - 1
    ].getAttribute("data-injectcss"),
    s = function (l, t) {
      t.parentNode.insertBefore(l, t);
    };
  if (d && !l.__iconfont__svg__cssinject__) {
    l.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      );
    } catch (l) {
      console && console.log(l);
    }
  }
  function c() {
    i || ((i = !0), o());
  }
  function h() {
    try {
      a.documentElement.doScroll("left");
    } catch (l) {
      return void setTimeout(h, 50);
    }
    c();
  }
  (t = function () {
    var l,
      t = document.createElement("div");
    (t.innerHTML = n),
      (n = null),
      (t = t.getElementsByTagName("svg")[0]) &&
        (t.setAttribute("aria-hidden", "true"),
        (t.style.position = "absolute"),
        (t.style.width = 0),
        (t.style.height = 0),
        (t.style.overflow = "hidden"),
        (t = t),
        (l = document.body).firstChild ? s(t, l.firstChild) : l.appendChild(t));
  }),
    document.addEventListener
      ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((e = function () {
            document.removeEventListener("DOMContentLoaded", e, !1), t();
          }),
          document.addEventListener("DOMContentLoaded", e, !1))
      : document.attachEvent &&
        ((o = t),
        (a = l.document),
        (i = !1),
        h(),
        (a.onreadystatechange = function () {
          "complete" == a.readyState && ((a.onreadystatechange = null), c());
        }));
})(window);
