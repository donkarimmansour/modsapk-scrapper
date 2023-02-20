const request = require('request');
const cheerio = require('cheerio');
const { insertEpisode } = require('./shared');

// get Episode
const getEpisode = (title , url) => {


    return new Promise((resolve, reject) => {


        const repeater = async () => {
            //encodeURI(url)
            request(url, async (err, res, body) => {
                if (err) reject(err)

                else if (res.statusCode === 200) {

                    console.log(`Get Episode : (${title}) => Start`);

                    const $ = cheerio.load(body);

                    const json = {
                        Location: "", Language: "", Country: "", Wins: "", CategoryWatch: "",
                        Duration: "", Category: "", Quality: "", Types: [],
                        Title: "",
                        Watches: [], Downloades: [], Tags: [] , Link : ""
                    } 


                    json.Link = url;  
                    json.Title = title;


                    json.Watches = $('.WatchServersList ul li a').map(function () {
                        return { name: $(this).text().trim(), url: $(this).attr('href') }
                    }).get()

                    json.Tags = $('.ThatsTags ol li a span').map(function () {
                        return $(this).text().trim()
                    }).get()

                    json.Downloades = $('.DownloadArea ul li a').map(function () {
                        return {
                            name: $(this).find("span").text().trim(),
                            quality: $(this).find("div span").eq(1).text().trim(),
                            size: $(this).find("div span").eq(0).text().trim(),
                            url: $(this).attr('href')
                        }
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

   
                    //return Episodes
                    resolve(json)

                } else {

                    if (res.statusCode == 503) {

                        repeater()

                    } else {

                        reject({ message: "getEpisode", status: res.statusCode })
                    }

                }

            })
        }


        repeater()

    })
}


// const link = [
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-16-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "16"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-15-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "15"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-14-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "14"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-13-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "13"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-12-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "12"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-11-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "11"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-10-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "10"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-9-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "9"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-8-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "8"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-7-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "7"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-6-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "6"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-5-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "5"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-4-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "4"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-3-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "3"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-2-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "2"
//     },
//     {
//         "url": "https://w.cima4up.link/%d9%85%d8%b3%d9%84%d8%b3%d9%84-fear-the-walking-dead-%d8%a7%d9%84%d9%85%d9%88%d8%b3%d9%85-6-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-1-%d9%85%d8%aa%d8%b1%d8%ac%d9%85%d8%a9/",
//         "title": "1"
//     }
// ]


// get All Episodes
const getAllEpisodes = (id , links) => {

    return new Promise(async (resolve, reject) => {

        const Links = links

            let step = 0, title = Links[0].title , url = Links[0].url
            const Episodes = []

            const repeater = async () => {

                await getEpisode(title , url).then(Episode => {
                    Episodes.push(Episode)
                    console.log(`Get Episode : (${Links.length}/${(title)}) => Finished`);
                }).catch(err => {
                    reject(err)
                })



                if (step >= (Links.length - 1)) {
                   // resolve({ Episodes: Episodes})
                    await insertEpisode(id, Episodes).then(res => {
                        resolve(res)
                    }).catch(err => {
                        reject({ message: err.message, status: err.status })
                    })
                } else {
                    step++
                    title = Links[step].title, url = Links[step].url

                    await repeater()
                }

            }

            await repeater()
    })
}
 


module.exports = {  getEpisode, getAllEpisodes }