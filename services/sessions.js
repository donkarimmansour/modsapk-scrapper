const request = require('request');
const cheerio = require('cheerio');
const { getAllEpisodes } = require("./episodes");
const { insertSession, downloadImage } = require('./shared');

// get Session
const getSession = (id , title , url) => {


    return new Promise((resolve, reject) => {


        const repeater = async () => {
            //encodeURI(url)
            request(url, async (err, res, body) => {
                if (err) reject(err)

                else if (res.statusCode === 200) {

                    console.log(`Get Session : (${title}) => Start`);

                    const $ = cheerio.load(body); 

                    const json = {
                        Location: "", Language: "", Country: "", Wins: "", CategoryWatch: "",
                        Duration: "", Category: "", Quality: "", Types: [],
                        Title: "", Year: "",
                        Poster: "", Rating: "", Tags: [] , Link : ""
                    }

                    json.Link = url;
                    json.Title = title;
                    json.Year = $('.BoxesInside .BoxItem .ContentHover strong').text().trim();
                    json.Rating = $('.MinSingleSelcted .Ratese span').text().trim();

                    json.Tags = $('.ThatsTags ol li a span').map(function () {
                        return $(this).text().trim()
                    }).get()




                    $('ul.SingleTerms li').each(function () {
                        const type = $(this).find('i + span').text().trim()

                        if (type === "التصنيف") {
                            json.Category = $(this).find('p').text().trim()
                        } else if (type === "المدة") {
                            json.Duration = $(this).find('p').text().trim()
                        } else if (type === "النوع") {
                            $(this).find('p a').each(function () { json.Types.push($(this).text().trim()) })
                        } else if (type === "الجودة") {
                            json.Quality = $(this).find('p').text().trim()
                        } else if (type === "البلد و اللغة") {
                            json.Country = $(this).find('p a').eq(0).text().trim()
                            json.Language = $(this).find('p a').eq(1).text().trim()
                        } else if (type === "تصنيف المشاهدة") {
                            json.CategoryWatch = $(this).find('p a').text().trim()
                        } else if (type === "الجوائز") {
                            json.Wins = $(this).find('p a').text().trim()
                        } else if (type === "مواقع التصوير") {
                            json.Location = $(this).find('p span').text().trim()
                        }


                    })

        
                                      
                    const Episodes = $('.BoxesInside .Miniselary a').map(function () {
                        return {
                            url: $(this).attr("href"),
                            title: $(this).find("em").text().trim(),
                        }
                    }).get()

                    const Poster = $('.ImgClass img').attr("data-img");

                    await downloadImage(Poster , json.Title , json.Year , "sessions").then(res => {
                        json.Poster = res
                    }).catch(err => {
                        reject({ message: err.message, status: err.status })
                    })


                    await insertSession(id, json).then(async (newId) => {

                        await getAllEpisodes(newId, Episodes?.reverse()).then(_episodes => {
                            //json.Episodes = episodes
                            resolve("")

                        }).catch(err => {
                            reject({ message: err.message, status: err.status })
                        })

                    }).catch(err => {
                        reject({ message: err.message, status: err.status })
                    })


                } else {

                    if (res.statusCode == 503) {

                        repeater()

                    } else {

                        reject({ message: "getSession", status: res.statusCode })
                    }

                }

            })
        }


        repeater()

    })
}


// const link =[
//     {
//         "title": "Fear the Walking Dead S07",
//         "url": "https://w.cima4up.link/selary/fear-the-walking-dead-s07/"
//     },
//     {
//         "title": "Fear the Walking Dead S06",
//         "url": "https://w.cima4up.link/selary/fear-the-walking-dead-s06/"
//     },
//     {
//         "title": "Fear the Walking Dead S05",
//         "url": "https://w.cima4up.link/selary/fear-the-walking-dead-s05/"
//     },
//     {
//         "title": "Fear the Walking Dead S04",
//         "url": "https://w.cima4up.link/selary/fear-the-walking-dead-s04/"
//     },
//     {
//         "title": "Fear the Walking Dead S03",
//         "url": "https://w.cima4up.link/selary/fear-the-walking-dead-s03/"
//     }
// ]

 
// get All Sessions
const getAllSessions = (id , links) => {

    return new Promise(async (resolve, reject) => {

        const Links = links

            let step = 0, title = Links[0].title, url = Links[0].url
            //const Sessions = []

            const repeater = async () => {

                await getSession(id , title , url).then(_session => {
                    //Sessions.push(Session)
                    console.log(`Get Session : (${Links.length}/${(title)}) => Finished`);
            
                }).catch(err => {
                    reject(err)
                })


                if (step >= (Links.length - 1)) {
                    resolve("")
                } else {
                    step++
                    title = Links[step].title , url = Links[step].url

                    await repeater()
                }

            }

            await repeater()
    })
}



module.exports = {  getSession, getAllSessions }