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

let enterdetailview = false;

function homePage(data) {
    let homes = document.getElementById("home-wrap");
    homes.style.display = "none";

    data.forEach(eachdata => {
        if (eachdata.fields.Name == "Cover Image") {
            let imgdata = eachdata.fields.Image;
            let imgurl = [];
            let imgtype = [];
            let imgtitle = [];
            imgdata.forEach(eachimg => {
                imgurl.push(eachimg.url);
                imgtype.push(eachimg.type);
                imgtitle.push(eachimg.filename);
            });
            let imgdiv = document.createElement("div");
            imgdiv.classList.add("img-slide");
            let imgindex = 0;
            imgdiv.innerHTML = `<img src="${imgurl[imgindex]}" alt="${imgtype[imgindex]}" title = "${imgtitle[imgindex]}">`;
            setInterval(()=>{
                // console.log(imgindex);
                imgindex ++;
                imgindex = imgindex % imgdata.length;
                imgdiv.innerHTML = `<img src="${imgurl[imgindex]}" alt="${imgtype[imgindex]}" title = "${imgtitle[imgindex]}">`;
                homes.appendChild(imgdiv);
            },5000);
            homes.appendChild(imgdiv);
        }
    });
}


function topicPage(data) {
    let main = document.getElementById("main");
    let imgcontainer = document.createElement("div");
    imgcontainer.id = "img-container";
    let topics = document.getElementById("topic-wrap");
    topics.style.display = "none";
    topics.classList.add("topic-wrap-thumbnail");
    let topicname = data[0].fields.Topic[0];
    //array to store all topics
    let alltopics = [];
    //store image thumbnail urls
    let allurls = [];
    //check duplicate topics
    data.forEach(eachdata => {
        if ( eachdata.fields.Topic[0] != topicname) {
            let topicdiv = document.createElement("div");
            allurls.push(eachdata.fields.Image[0].thumbnails.large.url);
            topicdiv.style.backgroundImage = `url("${eachdata.fields.Image[0].thumbnails.large.url}")`;
            let topic = document.createElement("h2");
            topic.className = "hover-effect-0";
            topicname = eachdata.fields.Topic[0];
            topic.innerText = topicname;
            topicdiv.appendChild(topic);
            topics.appendChild(topicdiv);
            //add topic to alltopics array
            alltopics.push(topicname);
            topic.classList.add("topic-heading");
        } 
    });
    // console.log(alltopics);
    //find records with same topic
    let topicheading = document.querySelectorAll("#topic-wrap > div > h2");
    for (let i = 0; i < topicheading.length; i ++) {
        topicheading[i].addEventListener("click", ()=>{
            let removetopicdiv = document.querySelectorAll("#topic-wrap > div");
            for (let j = 0; j < removetopicdiv.length; j++) {
                removetopicdiv[j].style.backgroundImage = "";
            }
            topics.classList.replace("topic-wrap-thumbnail","topic-wrap-large");
            //remove previous selected topic styling
            let removeheading = document.querySelectorAll("#topic-wrap > div > h2");
            for (let i = 0; i < removeheading.length; i++) {
                removeheading[i].style.backgroundColor = "transparent";
                removeheading[i].style.borderBottom = "none";
            }
            //style selected topic
            topicheading[i].style.backgroundColor = "rgba(0,0,0,0.15)";
            topicheading[i].style.borderBottom = "1px solid rgba(0,0,0,0.5)";
            enterdetailview = true;
            //check screen size
            if (window.innerWidth <= 800) {
                if (enterdetailview == true) {
                    topics.classList.add("topic-wrap-small");
                    topics.classList.remove("topic-wrap-large", "topic-wrap-thumbnail");
                } else {
                    topics.classList.add("topic-wrap-large");
                    topics.classList.remove("topic-wrap-small", "topic-wrap-thumbnail");
                }
            }
            imgcontainer.innerHTML = "";
            topics.style.display = "block";
            alltopics.forEach(eachtopic => {
                if (eachtopic == topicheading[i].innerHTML) {
                    data.forEach(eachdata => {
                        if (eachdata.fields.Topic[0] == eachtopic) {
                            showdetail(eachdata, imgcontainer);
                        }
                    });
                    let backicon = document.createElement("h4");
                    backicon.classList.add("hover-effect", "back-icon");
                    backicon.innerText = "Back";
                    imgcontainer.appendChild(backicon);
                    backicon.addEventListener("click", () => {
                        //palce bg img
                        let removetopicdiv = document.querySelectorAll("#topic-wrap > div");
                        let imglengthsize = allurls.length;
                        for (let i = 0; i < imglengthsize; i ++) {
                            removetopicdiv[i].style.backgroundImage = `url("${allurls[i]}")`;
                        }
                        //remove selected topic styling
                        let removeheading = document.querySelectorAll("#topic-wrap > div > h2");
                        for (let i = 0; i < removeheading.length; i++) {
                            removeheading[i].style.backgroundColor = "transparent";
                            removeheading[i].style.borderBottom = "none";
                        }
                        enterdetailview = false;
                        topics.classList.add("topic-wrap-thumbnail");
                        topics.classList.remove("topic-wrap-large", "topic-wrap-small");
                        topics.style.display = "flex";
                        imgcontainer.style.display = "none";
                        main.style.display = "block";
                    });
                }
            });
        });
    }
    navcontrol(imgcontainer, allurls);
}   

function photoPage(data) {
    document.getElementById("nav-photo").style.borderBottom = "1.5px solid rgba(0,0,0,0.5)";
    let main = document.getElementById("main");
    let imgcontainer = document.createElement("div");
    imgcontainer.id = "img-container";
    let photos = document.getElementById("photo-wrap");
    photos.classList.add("photo-wrap-large");
    //add labeldiv
    let labeldiv = document.createElement("div");
    labeldiv.className = "label-div";
    data.forEach(eachdata => {
        if (eachdata.fields.Name != "Cover Image") {
            let photoname = eachdata.fields.Name;
            let li = document.createElement("li");
            li.className = "hover-effect";
            li.innerText = photoname;
            photos.appendChild(li); 
            li.addEventListener("click", ()=> {
                //clear labeldiv content & remove selected title styling
                labeldiv.innerHTML = "";
                let removeli = document.querySelectorAll("#photo-wrap > li");
                for (let i = 0; i < removeli.length; i ++) {
                    removeli[i].style.backgroundColor = "transparent";
                    // removeli[i].style.borderBottom = "none";
                }
                //assign selected image's title styling
                li.style.backgroundColor = "rgba(0,0,0,0.15)";
                // li.style.borderBottom = "1px solid rgba(0,0,0,0.5)";
                enterdetailview = true;
                //screen size check
                if (window.innerWidth <= 800) {
                    if (enterdetailview == true) {
                        photos.classList.replace("photo-wrap-large", "photo-wrap-small");
                    }
                }
                //detailed images
                imgcontainer.innerHTML = "";
                showdetail(eachdata, imgcontainer);
                //show labels
                eachdata.fields.Label.forEach(eachlabel => {
                    // console.log(eachlabel);
                    let label = document.createElement("li");
                    label.innerText = `#${eachlabel}`;
                    labeldiv.appendChild(label);
                });
                photos.appendChild(labeldiv);
                //back icon
                let backicon = document.createElement("h4");
                backicon.classList.add("hover-effect", "back-icon");
                backicon.innerText = "Back";
                imgcontainer.appendChild(backicon);
                backicon.addEventListener("click", () => {
                    //remove selected image's title styling
                    let removeli = document.querySelectorAll("#photo-wrap > li");
                    for (let i = 0; i < removeli.length; i ++) {
                        removeli[i].style.backgroundColor = "transparent";
                        // removeli[i].style.borderBottom = "none";
                    }
                    //remove labeldiv
                    labeldiv.innerHTML = "";
                    enterdetailview = false;
                    photos.style.display = "flex";
                    photos.classList.replace("photo-wrap-small", "photo-wrap-large");
                    imgcontainer.style.display = "none";
                    main.style.display = "block";
                });
            });
        }
    });
    navcontrol(imgcontainer, '');
}

function showdetail(detaildata, imgwrap){
    imgwrap.style.display = "flex";
    imgwrap.style.flexDirection = "column";
    imgwrap.style.alignItems = "flex-start";
    imgwrap.style.margin = "3em 4em 8em 4em";

    let photos = document.getElementById("photo-wrap");
    let main = document.getElementById("main");

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
        `;
            // <p>${detaildata.fields.Description}</p>
        imgwrap.appendChild(imginfo);
    } else {
        photos.style.display = "none";
        imgwrap.style.alignItems = "center";
    }
    imgdiv = document.createElement("div");
    imgdiv.className = "img-div";
    imgdata.forEach(eachimg => {
        // console.log(eachimg);
        img = document.createElement("img");
        img.src = eachimg.url;
        img.alt = "";
        img.title = eachimg.filename;
        imgdiv.appendChild(img);
        imgwrap.appendChild(imgdiv); 
    });
}

function navcontrol(imgwrap, data){
    let main = document.getElementById("main");
    let homenav = document.getElementById("nav-home");
    let topicnav = document.getElementById("nav-topic");
    let photonav = document.getElementById("nav-photo");
    let topics = document.getElementById("topic-wrap");
    let homes = document.getElementById("home-wrap");
    let photos = document.getElementById("photo-wrap");
    // let imgwrap = document.getElementById("img-container");
    homenav.addEventListener("click",()=>{
        document.getElementById("nav-photo").style.borderBottom = "none";
        document.getElementById("nav-topic").style.borderBottom = "none";
        document.getElementById("nav-home").style.borderBottom = "1.5px solid rgba(0,0,0,0.5)";
        // console.log("Home");
        homes.style.display = "block";
        topics.style.display = "none";
        photos.style.display = "none";
        imgwrap.innerHTML = "";
        imgwrap.style.display = "none";
        main.style.display = "block";
    });
    topicnav.addEventListener("click",()=>{
        // console.log("topic");
        document.getElementById("nav-topic").style.borderBottom = "1.5px solid rgba(0,0,0,0.5)";
        document.getElementById("nav-photo").style.borderBottom = "none";
        document.getElementById("nav-home").style.borderBottom = "none";
        //topic bg img
        let removetopicdiv = document.querySelectorAll("#topic-wrap > div");
        let imglengthsize = data.length;
        for (let i = 0; i< imglengthsize; i ++) {
            removetopicdiv[i].style.backgroundImage = `url("${data[i]}")`;
        }
        //remove selected topic styling
        let removeheading = document.querySelectorAll("#topic-wrap > div > h2");
        for (let i = 0; i < removeheading.length; i++) {
            removeheading[i].style.backgroundColor = "transparent";
            removeheading[i].style.borderBottom = "none";
        }
        enterdetailview = false;
        homes.style.display = "none";
        topics.style.display = "flex";
        topics.classList.add("topic-wrap-thumbnail");
        topics.classList.remove("topic-wrap-large", "topic-wrap-small");
        photos.style.display = "none";
        imgwrap.innerHTML = "";
        imgwrap.style.display = "none";
        main.style.display = "block";
    });
    photonav.addEventListener("click",()=>{
        document.getElementById("nav-photo").style.borderBottom = "1.5px solid rgba(0,0,0,0.5)";
        document.getElementById("nav-home").style.borderBottom = "none";
        document.getElementById("nav-topic").style.borderBottom = "none";
        // console.log("photo");
        //remove selected image's title styling
        let removeli = document.querySelectorAll("#photo-wrap > li");
        for (let i = 0; i < removeli.length; i ++) {
            removeli[i].style.backgroundColor = "transparent";
            // removeli[i].style.borderBottom = "none";
        }
        let labeldiv = document.querySelectorAll(".label-div");
        for (let i = 0; i < labeldiv.length; i++) {
            labeldiv[i].innerHTML = "";
        }
        enterdetailview = false;
        photos.classList.replace("photo-wrap-small", "photo-wrap-large");
        homes.style.display = "none";
        topics.style.display = "none";
        photos.style.display = "flex";
        imgwrap.innerHTML = "";
        imgwrap.style.display = "none";
        main.style.display = "block";
    });
}

//media query
let photos = document.querySelector("#photo-wrap");
let topics = document.querySelector("#topic-wrap");
let x = window.matchMedia("(max-width: 800px)");
function screenTest(e){
    if (e.matches) {
        if (enterdetailview == true) {
            topics.classList.add("topic-wrap-small");
            topics.classList.remove("topic-wrap-large", "topic-wrap-thumbnail");
            photos.classList.replace("photo-wrap-large", "photo-wrap-small");
        } 
        if (enterdetailview == false) {
            topics.classList.add("topic-wrap-thumbnail");
            topics.classList.remove("topic-wrap-large", "topic-wrap-small");
            photos.classList.replace("photo-wrap-small", "photo-wrap-large");
        }
    } 
    else {
        photos.classList.replace("photo-wrap-small", "photo-wrap-large");
        if (enterdetailview == true) {
            topics.classList.add("topic-wrap-large");
            topics.classList.remove("topic-wrap-small", "topic-wrap-thumbnail");
        }
        if (enterdetailview == false) {
            topics.classList.add("topic-wrap-thumbnail");
            topics.classList.remove("topic-wrap-large", "topic-wrap-small");
        }
    }
}
x.addListener(screenTest);


