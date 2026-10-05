(() => {

const ready = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
};

ready(() => {

  const root =
    document.querySelector("article") ||
    document.querySelector("main") ||
    document.querySelector(".content");

  if (!root) return;


  /* =========================
     共通スタイル
  ========================== */

  const style = document.createElement("style");

  style.textContent = `

  html{
    scroll-behavior:smooth;
  }

  h2[id],
  h3[id]{
    scroll-margin-top:28px;
  }


  /* 読書進捗 */

  #koropop-progress{
    position:fixed;
    top:0;
    left:0;
    width:0;
    height:4px;
    z-index:99999;
    background:
      linear-gradient(
        90deg,
        #1677df,
        #6e56cf
      );
    transition:width .08s linear;
  }


  /* パンくず */

  .koropop-breadcrumb{
    width:min(100% - 28px,1120px);
    margin:8px auto 0;
    display:flex;
    align-items:center;
    flex-wrap:wrap;
    gap:7px;
    font-size:.78rem;
    color:#667085;
  }

  .koropop-breadcrumb a{
    color:#52697f;
    text-decoration:none;
  }

  .koropop-breadcrumb a:hover{
    text-decoration:underline;
  }

  .koropop-breadcrumb-current{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    max-width:420px;
  }


  /* 記事情報 */

  .koropop-article-meta{
    display:flex;
    flex-wrap:wrap;
    gap:7px;
    margin:12px 0 4px;
  }

  .koropop-meta-pill{
    display:inline-flex;
    align-items:center;
    gap:4px;
    padding:5px 9px;
    border-radius:999px;
    background:#f3f6fa;
    border:1px solid #e1e7ee;
    color:#5f6f7f;
    font-size:.76rem;
    font-weight:650;
  }


  /* 自動目次 */

  .koropop-auto-toc{
    margin:12px 0 38px;
    border:1px solid #d6e1ec;
    border-radius:16px;
    background:
      linear-gradient(
        135deg,
        #f7fbff,
        #fff 55%,
        #f7f4ff
      );
    box-shadow:
      0 7px 24px
      rgba(16,24,40,.045);
    overflow:hidden;
  }

  .koropop-auto-toc summary{
    display:flex;
    align-items:center;
    gap:10px;
    padding:17px 20px;
    cursor:pointer;
    list-style:none;
    background:#eef6fd;
    border-bottom:1px solid #dae6f0;
  }

  .koropop-auto-toc summary::-webkit-details-marker{
    display:none;
  }

  .koropop-auto-toc summary:after{
    content:"−";
    margin-left:auto;
    width:26px;
    height:26px;
    display:grid;
    place-items:center;
    border-radius:50%;
    background:#fff;
    border:1px solid #d4e2ef;
    color:#1769b0;
    font-weight:900;
  }

  .koropop-auto-toc
  details:not([open])
  summary:after{
    content:"+";
  }

  .koropop-toc-title{
    font-size:1.04rem;
    font-weight:900;
    color:#183a61;
  }

  .koropop-toc-note{
    color:#667085;
    font-size:.77rem;
  }

  .koropop-auto-toc ol{
    margin:0;
    padding:18px 24px 21px 46px;
  }

  .koropop-auto-toc li{
    padding:5px 0;
  }

  .koropop-auto-toc a{
    color:#1769b0;
    text-decoration:none;
    font-weight:650;
    line-height:1.55;
  }

  .koropop-auto-toc a:hover{
    text-decoration:underline;
  }

  .koropop-auto-toc
  .koropop-sub{
    margin-left:15px;
    font-size:.9rem;
  }

  .koropop-auto-toc
  .koropop-sub a{
    color:#52697f;
    font-weight:550;
  }


  /* 右下ボタン */

  .koropop-reader-actions{
    position:fixed;
    right:16px;
    bottom:18px;
    z-index:9990;
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    gap:8px;
  }

  .koropop-reader-btn{
    appearance:none;
    border:1px solid #d8e2ec;
    background:rgba(255,255,255,.96);
    color:#174a7e;
    box-shadow:
      0 7px 22px
      rgba(16,24,40,.12);
    border-radius:999px;
    padding:10px 13px;
    font:inherit;
    font-size:.82rem;
    font-weight:850;
    cursor:pointer;
    backdrop-filter:blur(8px);
  }

  .koropop-reader-btn:hover{
    transform:translateY(-1px);
  }

  #koropop-top-btn{
    opacity:0;
    pointer-events:none;
    transform:translateY(5px);
    transition:.15s;
  }

  #koropop-top-btn.show{
    opacity:1;
    pointer-events:auto;
    transform:none;
  }


  @media(max-width:600px){

    .koropop-breadcrumb{
      margin-top:5px;
      font-size:.73rem;
    }

    .koropop-breadcrumb-current{
      max-width:190px;
    }

    .koropop-auto-toc{
      border-radius:14px;
      margin-bottom:30px;
    }

    .koropop-auto-toc summary{
      padding:15px 16px;
    }

    .koropop-toc-note{
      display:none;
    }

    .koropop-auto-toc ol{
      padding:
        15px 17px
        18px 38px;
    }

    .koropop-reader-actions{
      right:11px;
      bottom:13px;
    }

    .koropop-reader-btn{
      padding:10px 12px;
    }

  }

  `;

  document.head.appendChild(style);


  /* =========================
     進捗バー
  ========================== */

  const progress =
    document.createElement("div");

  progress.id =
    "koropop-progress";

  document.body.appendChild(
    progress
  );


  function updateProgress(){

    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const pct =
      height > 0
      ? Math.min(
          100,
          Math.max(
            0,
            scrollTop / height * 100
          )
        )
      : 0;

    progress.style.width =
      pct + "%";
  }


  /* =========================
     記事タイトル
  ========================== */

  const h1 =
    document.querySelector("h1");

  const cleanTitle =
    h1
    ? h1.textContent
        .replace(/\s+/g," ")
        .trim()
    : document.title
        .split("｜")[0]
        .trim();


  /* =========================
     パンくず
  ========================== */

  if(
    !document.querySelector(
      ".koropop-breadcrumb"
    )
  ){

    const breadcrumb =
      document.createElement("nav");

    breadcrumb.className =
      "koropop-breadcrumb";

    breadcrumb.setAttribute(
      "aria-label",
      "パンくず"
    );


    const pathText =
      (
        location.pathname +
        " " +
        cleanTitle
      ).toLowerCase();


    const isIT =
      /it|エンジニア|社内se|ヘルプデスク|インフラ|ネットワーク|クラウド|soc|プログラミング/
      .test(pathText);


    breadcrumb.innerHTML = `
      <a href="index.html">
        トップ
      </a>

      <span>›</span>

      <a href="career.html">
        仕事・転職
      </a>

      ${
        isIT
        ? `
          <span>›</span>

          <a href="mikeiken-it-tenshoku.html">
            IT転職
          </a>
        `
        : ""
      }

      <span>›</span>

      <span class="koropop-breadcrumb-current">
        ${escapeHtml(cleanTitle)}
      </span>
    `;


    const hero =
      document.querySelector(".hero");

    if(hero){

      hero.parentNode.insertBefore(
        breadcrumb,
        hero
      );

    }else{

      root.parentNode.insertBefore(
        breadcrumb,
        root
      );

    }

  }


  /* =========================
     読了時間
  ========================== */

  const clone =
    root.cloneNode(true);

  clone
    .querySelectorAll(
      "nav,aside,script,style"
    )
    .forEach(el => el.remove());

  const chars =
    clone.textContent
      .replace(/\s+/g,"")
      .length;

  const minutes =
    Math.max(
      1,
      Math.ceil(chars / 500)
    );


  /* =========================
     更新日
  ========================== */

  let updated = "";

  const updatedMeta =
    document.querySelector(
      'meta[name="koropop-updated"]'
    );

  if(updatedMeta){
    updated =
      updatedMeta.content;
  }


  if(!updated){

    const ld =
      [
        ...document.querySelectorAll(
          'script[type="application/ld+json"]'
        )
      ];

    for(const script of ld){

      try{

        const data =
          JSON.parse(
            script.textContent
          );

        const objects =
          data["@graph"] ||
          [data];

        const article =
          objects.find(
            x =>
              x &&
              (
                x["@type"] === "Article" ||
                x["@type"] ===
                "BlogPosting"
              )
          );

        if(
          article &&
          article.dateModified
        ){
          updated =
            article.dateModified;
          break;
        }

      }catch(e){}

    }

  }


  /* =========================
     タイトル下メタ情報
  ========================== */

  if(
    h1 &&
    !document.querySelector(
      ".koropop-article-meta"
    )
  ){

    const meta =
      document.createElement("div");

    meta.className =
      "koropop-article-meta";

    let html = `
      <span class="koropop-meta-pill">
        ⏱ 約${minutes}分
      </span>
    `;

    if(updated){

      html += `
        <span class="koropop-meta-pill">
          🔄 更新 ${formatDate(updated)}
        </span>
      `;

    }

    meta.innerHTML = html;

    h1.insertAdjacentElement(
      "afterend",
      meta
    );


    const oldUpdated =
      document.querySelector(
        ".updated"
      );

    if(
      oldUpdated &&
      !oldUpdated.closest(
        ".koropop-article-meta"
      )
    ){
      oldUpdated.style.display =
        "none";
    }

  }


  /* =========================
     目次
  ========================== */

  let toc =
    document.querySelector(
      ".toc, [data-koropop-toc], nav[aria-label='目次']"
    );


  if(toc){

    toc.setAttribute(
      "data-koropop-toc",
      "existing"
    );

  }else{

    let headings =
      [
        ...root.querySelectorAll(
          "h2,h3"
        )
      ]
      .filter(heading => {

        if(
          !heading.textContent.trim()
        ){
          return false;
        }

        if(
          heading.closest(
            "nav,aside,.side,.sidebox,footer"
          )
        ){
          return false;
        }

        return true;

      });


    if(headings.length > 18){

      headings =
        headings.filter(
          heading =>
            heading.tagName === "H2"
        );

    }


    if(headings.length >= 2){

      const used =
        new Set(
          [
            ...document.querySelectorAll(
              "[id]"
            )
          ].map(el => el.id)
        );


      headings.forEach(
        (heading,index) => {

          if(heading.id){
            return;
          }

          let id =
            "section-" +
            (index + 1);

          let n = 2;

          while(used.has(id)){

            id =
              "section-" +
              (index + 1) +
              "-" +
              n;

            n++;
          }

          heading.id = id;
          used.add(id);

        }
      );


      toc =
        document.createElement("nav");

      toc.className =
        "koropop-auto-toc";

      toc.setAttribute(
        "aria-label",
        "目次"
      );

      toc.setAttribute(
        "data-koropop-toc",
        "auto"
      );


      const details =
        document.createElement(
          "details"
        );

      details.open = true;


      const summary =
        document.createElement(
          "summary"
        );

      summary.innerHTML = `
        <span class="koropop-toc-title">
          📑 目次
        </span>

        <span class="koropop-toc-note">
          気になる項目へジャンプ
        </span>
      `;


      const list =
        document.createElement("ol");


      headings.forEach(
        heading => {

          const item =
            document.createElement(
              "li"
            );

          if(
            heading.tagName === "H3"
          ){
            item.className =
              "koropop-sub";
          }

          const link =
            document.createElement(
              "a"
            );

          link.href =
            "#" + heading.id;

          link.textContent =
            heading.textContent
              .replace(/\s+/g," ")
              .trim();

          item.appendChild(
            link
          );

          list.appendChild(
            item
          );

        }
      );


      details.appendChild(
        summary
      );

      details.appendChild(
        list
      );

      toc.appendChild(
        details
      );


      const first =
        headings[0];

      first.parentNode.insertBefore(
        toc,
        first
      );

    }

  }


  /* =========================
     右下固定ボタン
  ========================== */

  const actions =
    document.createElement("div");

  actions.className =
    "koropop-reader-actions";


  if(toc){

    const tocButton =
      document.createElement(
        "button"
      );

    tocButton.type =
      "button";

    tocButton.className =
      "koropop-reader-btn";

    tocButton.textContent =
      "📑 目次";

    tocButton.setAttribute(
      "aria-label",
      "目次へ移動"
    );


    tocButton.addEventListener(
      "click",
      () => {

        const details =
          toc.querySelector(
            "details"
          );

        if(details){
          details.open = true;
        }

        toc.scrollIntoView({
          behavior:"smooth",
          block:"start"
        });

      }
    );


    actions.appendChild(
      tocButton
    );

  }


  const topButton =
    document.createElement(
      "button"
    );

  topButton.type =
    "button";

  topButton.id =
    "koropop-top-btn";

  topButton.className =
    "koropop-reader-btn";

  topButton.textContent =
    "↑ 上へ";

  topButton.setAttribute(
    "aria-label",
    "ページ上部へ戻る"
  );


  topButton.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top:0,
        behavior:"smooth"
      });

    }
  );


  actions.appendChild(
    topButton
  );

  document.body.appendChild(
    actions
  );


  function onScroll(){

    updateProgress();

    if(window.scrollY > 650){
      topButton.classList.add(
        "show"
      );
    }else{
      topButton.classList.remove(
        "show"
      );
    }

  }


  window.addEventListener(
    "scroll",
    onScroll,
    {passive:true}
  );

  onScroll();


  /* =========================
     helpers
  ========================== */

  function formatDate(value){

    const match =
      String(value).match(
        /(\d{4})-(\d{2})-(\d{2})/
      );

    if(!match){
      return value;
    }

    return (
      match[1] +
      "/" +
      Number(match[2]) +
      "/" +
      Number(match[3])
    );

  }


  function escapeHtml(value){

    const div =
      document.createElement("div");

    div.textContent =
      value;

    return div.innerHTML;

  }

});

})();


/* KOROPOP_RELATED_LOADER */
(() => {

  if(
    document.querySelector(
      'script[src*="koropop-related.js"]'
    )
  ){
    return;
  }

  const script =
    document.createElement("script");

  script.src =
    "koropop-related.js";

  script.async = true;

  document.head.appendChild(
    script
  );

})();

