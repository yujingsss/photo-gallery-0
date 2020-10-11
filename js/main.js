var Airtable = require('airtable');
var base = new Airtable({apiKey: 'key9lokycPO090Rlh'}).base('appflVcgYQgB25Lw1');

base('Photos').select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    // records.forEach(function(record) {
    //     console.log(record, record.get("Number"));
    // });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

    const recordData = records;
    photoPage(recordData);
    topicPage(recordData);
    homePage(recordData);

}, function done(err) {
    if (err) { console.error(err); return; }
});

function homePage(data) {
    let navindex = 0;

    let homes = document.getElementById("home-wrap");
    homes.style.display = "none";
    homes.style.justifyContent = "center";
    
    let imgcontainer = document.createElement("div");
    imgcontainer.id = "img-container";
    imgcontainer.style.display = "flex";
    imgcontainer.style.flexDirection = "column";
    imgcontainer.style.margin = "1em 4em 8em 4em";
    homes.appendChild(imgcontainer);
    data.forEach(eachdata => {
        if (eachdata.fields.Name == "Cover Image") {
            // console.log(eachdata);
            let imgdata = eachdata.fields.Image;
            let imgdiv;
            imgdata.forEach(eachimg => {
                // console.log(eachimg);
                imgdiv = document.createElement("div");
                imgdiv.innerHTML = `<img src="${eachimg.url}" alt="${eachimg.type}" title = "${eachimg.filename}">`;
                imgcontainer.appendChild(imgdiv); 
            });
        }
    });
}

function topicPage(data) {
    // console.log(data);
    let navindex = 1;

    let imgcontainer = document.createElement("div");
    imgcontainer.id = "img-container";
    let topics = document.getElementById("topic-wrap");
    topics.style.display = "none";
    let topicname = data[0].fields.Topic[0];
    let alltopics = [];
    //check duplicate topics
    data.forEach(eachdata => {
        if ( eachdata.fields.Topic[0] != topicname) {
            // console.log(eachdata.fields.Topic[0]);
            let topicdiv = document.createElement("div");
            let topic = document.createElement("h2");
            topic.className = "hover-effect";
            topicname = eachdata.fields.Topic[0];
            topic.innerText = topicname;
            topicdiv.appendChild(topic);
            topics.appendChild(topicdiv);
            alltopics.push(topicname);
            topic.classList.add("topic-heading");
            topicdiv.classList.add("topic-div", "topic-container");
        } 
    });
    // console.log(alltopics);
    //find records with same topic
    let topicheading = document.getElementsByClassName("topic-heading");
    // console.log(topicheading);
    // let topicdiv = document.getElementsByClassName("topic-div");
    // console.log(topicdiv);
    for (let i = 0; i < topicheading.length; i ++) {
        topicheading[i].addEventListener("click", ()=>{
            imgcontainer.innerHTML = "";
            topics.style.display = "block";
            alltopics.forEach(eachtopic => {
                if (eachtopic == topicheading[i].innerHTML) {
                    // console.log(eachtopic);
                    data.forEach(eachdata => {
                        if (eachdata.fields.Topic[0] == eachtopic) {
                            showdetail(eachdata, navindex, imgcontainer);
                            // for (let j = 0; j < topicdiv.length; j ++){
                            //     topicdiv[j].classList.remove("topic-div");
                            // }
                        }
                    });
                }
            });
        });
    }
    navcontrol(navindex, imgcontainer);
}   

function photoPage(data) {
    // console.log(data);
    let navindex = 2;

    let imgcontainer = document.createElement("div");
    imgcontainer.id = "img-container";
    let photos = document.getElementById("photo-wrap");
    data.forEach(eachdata => {
        let photoname = eachdata.fields.Name;
        let li = document.createElement("li");
        li.className = "hover-effect";
        li.innerText = photoname;
        photos.appendChild(li); 
        li.addEventListener("click", ()=> {
            // console.log(eachdata);
            imgcontainer.innerHTML = "";
            showdetail(eachdata, navindex, imgcontainer);
        });
    });
    navcontrol(navindex, imgcontainer);
}

function showdetail(detaildata, index, imgwrap){
    // console.log(detaildata);
    imgwrap.style.display = "flex";
    imgwrap.style.flexDirection = "column";
    imgwrap.style.alignItems = "flex-start";
    imgwrap.style.margin = "3em 4em 8em 4em";

    let topics = document.getElementById("topic-wrap");
    // let homes = document.getElementById("home-wrap");
    let photos = document.getElementById("photo-wrap");
    let main = document.getElementById("main");
    // let topicdiv = document.getElementsByClassName("topic-container");

    let imgdata = detaildata.fields.Image;
    main.appendChild(imgwrap);
    let imgdiv;

    main.style.display = "flex";
    main.style.justifyContent = "center";

    if (detaildata.fields.Name != "Cover Image"){
        let imginfo = document.createElement("div");
        imginfo.classList = "img-info";
        imginfo.innerHTML = `
            <h4>${detaildata.fields.Name}</h4>
            <li>${detaildata.fields.Author}</li>
            <li>${detaildata.fields.Year}</li>
            <li>${detaildata.fields.Place}</li>
            <li>${detaildata.fields.Camera[0]}</li>
            <p>${detaildata.fields.Description}</p>
        `;
        imgwrap.appendChild(imginfo);
    } else {
        photos.style.display = "none";
        imgwrap.style.alignItems = "center";
    }

    imgdata.forEach(eachimg => {
        // console.log(eachimg);
        imgdiv = document.createElement("div");
        imgdiv.innerHTML = `<img src="${eachimg.url}" alt="${eachimg.type}" title = "${eachimg.filename}">`;
        imgwrap.appendChild(imgdiv); 
    });

    let backicon = document.createElement("h4");
    backicon.className = "hover-effect";
    backicon.innerText = "BACK";
    backicon.style.userSelect = "none";
    backicon.style.fontWeight = "500";
    imgwrap.appendChild(backicon);

    backicon.addEventListener("click", () => {
        // console.log(index);
        if (index == 1) {
            topics.style.display = "flex";
            imgwrap.style.display = "none";
            main.style.display = "block";
        }
        else if (index == 2) {
            photos.style.display = "flex";
            imgwrap.style.display = "none";
            main.style.display = "block";
        } 
        else if (index = 0) {

        }
    });
    navcontrol(index, imgwrap);
}

function navcontrol(index, imgwrap){
    let main = document.getElementById("main");
    let homenav = document.getElementById("nav-home");
    let topicnav = document.getElementById("nav-topic");
    let photonav = document.getElementById("nav-photo");
    let topics = document.getElementById("topic-wrap");
    let homes = document.getElementById("home-wrap");
    let photos = document.getElementById("photo-wrap");
    // let imgwrap = document.getElementById("img-container");
    homenav.addEventListener("click",()=>{
        // console.log("Home");
        homes.style.display = "flex";
        topics.style.display = "none";
        photos.style.display = "none";
        imgwrap.innerHTML = "";
        imgwrap.style.display = "none";
        main.style.display = "block";
    });
    topicnav.addEventListener("click",()=>{
        // console.log("topic");
        homes.style.display = "none";
        topics.style.display = "flex";
        photos.style.display = "none";
        imgwrap.innerHTML = "";
        imgwrap.style.display = "none";
        main.style.display = "block";
    });
    photonav.addEventListener("click",()=>{
        // console.log("photo");
        homes.style.display = "none";
        topics.style.display = "none";
        photos.style.display = "flex";
        imgwrap.innerHTML = "";
        imgwrap.style.display = "none";
        main.style.display = "block";
    });
}
