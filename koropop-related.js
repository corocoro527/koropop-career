(() => {

async function initRelated(){

  const article =
    document.querySelector("article") ||
    document.querySelector("main");

  if(!article){
    return;
  }


  if(
    document.querySelector(
      ".koropop-related-auto"
    )
  ){
    return;
  }


  let data = [];

  try{

    const response =
      await fetch(
        "koropop-articles.json?v=2",
        {
          cache:"no-cache"
        }
      );

    if(!response.ok){
      return;
    }

    data = await response.json();

  }catch(error){
    return;
  }


  const currentUrl =
    decodeURIComponent(
      location.pathname
      .split("/")
      .pop()
    );


  const current =
    data.find(
      item =>
        item.url === currentUrl
    );


  if(!current){
    return;
  }


  function score(candidate){

    let points = 0;

    if(
      candidate.category ===
      current.category
    ){
      points += 12;
    }


    const shared =
      candidate.tags.filter(
        tag =>
          current.tags.includes(tag)
      );

    points +=
      shared.length * 5;


    if(
      current.category === "it" &&
      candidate.category === "it"
    ){
      points += 4;
    }


    return points;
  }


  let candidates =
    data
    .filter(
      item =>
        item.url !== current.url
    )
    .map(
      item => ({
        ...item,
        score:score(item)
      })
    )
    .sort(
      (a,b) =>
        b.score - a.score
    );


  let related =
    candidates
    .filter(
      item =>
        item.score > 0
    )
    .slice(0,4);


  if(related.length < 4){

    const used =
      new Set(
        related.map(
          item => item.url
        )
      );

    for(const item of candidates){

      if(
        related.length >= 4
      ){
        break;
      }

      if(
        !used.has(item.url)
      ){

        related.push(item);

        used.add(
          item.url
        );

      }

    }

  }


  if(related.length === 0){
    return;
  }


  const section =
    document.createElement(
      "section"
    );

  section.className =
    "koropop-related-auto";


  const cards =
    related
    .map(item => {

      let description =
        item.description || "";

      if(
        description.length > 90
      ){
        description =
          description
          .slice(0,87)
          .trim()
          + "…";
      }

      return `
        <a
          class="koropop-related-card"
          href="${escapeHtml(item.url)}"
        >

          <span class="koropop-related-label">
            ${label(item.category)}
          </span>

          <strong>
            ${escapeHtml(item.title)}
          </strong>

          <span class="koropop-related-desc">
            ${escapeHtml(description)}
          </span>

          <span class="koropop-related-more">
            続きを読む →
          </span>

        </a>
      `;

    })
    .join("");


  section.innerHTML = `

    <div class="koropop-related-head">

      <div>

        <span class="koropop-related-eyebrow">
          NEXT
        </span>

        <h2>
          次に読むならこれ
        </h2>

        <p>
          今読んでいる内容に近い記事を
          自動で選んでいます。
        </p>

      </div>

      <a
        class="koropop-related-all"
        href="career.html"
      >
        仕事・転職の記事一覧 →
      </a>

    </div>

    <div class="koropop-related-grid">
      ${cards}
    </div>

  `;


  const sources =
    article.querySelector(
      ".sources"
    );


  if(sources){

    sources.insertAdjacentElement(
      "beforebegin",
      section
    );

  }else{

    article.appendChild(
      section
    );

  }


  const style =
    document.createElement(
      "style"
    );

  style.textContent = `

  .koropop-related-auto{
    margin:52px 0 44px;
    padding:25px;
    border:1px solid #d9e3ed;
    border-radius:18px;
    background:
      linear-gradient(
        135deg,
        #f7fbff,
        #ffffff 55%,
        #f8f5ff
      );
  }

  .koropop-related-head{
    display:flex;
    justify-content:space-between;
    align-items:end;
    gap:18px;
    margin-bottom:18px;
  }

  .koropop-related-head h2{
    margin:3px 0 5px;
    padding:0;
    border:0;
    background:none;
  }

  .koropop-related-head p{
    margin:0;
    color:#667085;
    font-size:.9rem;
  }

  .koropop-related-eyebrow{
    color:#6e56cf;
    font-size:.73rem;
    font-weight:900;
    letter-spacing:.12em;
  }

  .koropop-related-all{
    flex:0 0 auto;
    font-size:.84rem;
    font-weight:800;
    text-decoration:none;
  }

  .koropop-related-grid{
    display:grid;
    grid-template-columns:
      repeat(2,1fr);
    gap:11px;
  }

  .koropop-related-card{
    display:flex;
    flex-direction:column;
    gap:7px;
    min-width:0;
    padding:17px;
    background:#fff;
    border:1px solid #dfe6ee;
    border-radius:14px;
    color:inherit;
    text-decoration:none;
    transition:
      transform .15s ease,
      box-shadow .15s ease,
      border-color .15s ease;
  }

  .koropop-related-card:hover{
    transform:translateY(-2px);
    border-color:#bfd4e7;
    box-shadow:
      0 8px 24px
      rgba(16,24,40,.07);
  }

  .koropop-related-card strong{
    color:#174a7e;
    line-height:1.5;
  }

  .koropop-related-label{
    align-self:flex-start;
    padding:4px 8px;
    border-radius:999px;
    background:#eef5fc;
    color:#35658e;
    font-size:.7rem;
    font-weight:800;
  }

  .koropop-related-desc{
    color:#667085;
    font-size:.86rem;
    line-height:1.65;
  }

  .koropop-related-more{
    margin-top:auto;
    padding-top:3px;
    color:#1677df;
    font-size:.8rem;
    font-weight:800;
  }


  @media(max-width:650px){

    .koropop-related-auto{
      margin-top:40px;
      padding:18px;
      border-radius:15px;
    }

    .koropop-related-head{
      display:block;
    }

    .koropop-related-all{
      display:inline-block;
      margin-top:9px;
    }

    .koropop-related-grid{
      grid-template-columns:1fr;
    }

  }

  `;

  document.head.appendChild(
    style
  );

}


function label(category){

  if(category === "it"){
    return "💻 IT転職";
  }

  if(category === "work"){
    return "💼 仕事選び";
  }

  return "🧭 転職";
}


function escapeHtml(value){

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    String(value || "");

  return div.innerHTML;
}


if(
  document.readyState ===
  "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    initRelated
  );

}else{

  initRelated();

}

})();
