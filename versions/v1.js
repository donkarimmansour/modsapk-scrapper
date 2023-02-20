const { ApiEndpoints } = require("../common/apiEndpoints")
const { app  } = require("../server")

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
 


app.get('/', (req, res) => {
        
     //const url = `https://apkmody.io/apps?page=154`
       const url = 'https://apkmody.io/games/toca-life-world'

    request(url , async (err, respnse, body) => {

        if (err){
            res.json({ err: err })
        }else if (res.statusCode === 200) {
            const $ = cheerio.load(body)


            const json = {
                name: "", rating: 0, link: "", update: "",
                modFeatures: [], descriptions: [{ lang: "", text: "" }],
                reviews: [{ name: "", date: "", img: "", rating: 0, comment: "", replies: [{ name: "", date: "", img: "", comment: ""}]}],
                versions: [{ version: "", icon: "", size: "", link: 0, text: "" }],
                info: { name: "", packageName: "", publisher: "", category: "", modFeatures: "", version: "", size: "", price: "", requires: "" }
            }


            // json.link = url
             json.name = $('.app-name h1 strong').text().trim()
            // json.rating = $('.app-name .rating .active').length
            // json.update = $('.app-name h1 + span time').attr("datetime")


            // $('table.has-fixed-layout tbody tr').each(function () {
            //     const type = $(this).find('th').text().trim()

            //     if (type === "Name") {
            //         json.info.name = $(this).find('td').text().trim()
            //     } else if (type === "Package Name") {
            //         json.info.packageName = $(this).find('td').text().trim()
            //     } else if (type === "Publisher") {
            //         json.info.publisher = $(this).find('td').text().trim()
            //     } else if (type === "Category") {
            //         json.info.category = $(this).find('td').text().trim()
            //     } else if (type === "MOD Features") {
            //         json.info.modFeatures = $(this).find('td').text().trim()
            //     } else if (type === "Version") {
            //         json.info.version = $(this).find('td').text().trim()
            //     } else if (type === "Size") {
            //         json.info.size = $(this).find('td').text().trim()
            //     } else if (type === "Price") {
            //         json.info.price = $(this).find('td').text().trim()
            //     } else if (type === "Requires") {
            //         json.info.requires = $(this).find('td').text().trim()
            //     }


            // })


            // json.modFeatures = $('h2 + ul.mod-features-list li').map(function () {
            //     return $(this).text().trim().replace(/[- ]/g, "")
            // }).get()





            // json.reviews = $('#comments > ul li').map(function () {
            //     return {
            //         name: $(this).find(".wp-block-latest-comments__comment-meta strong").text().trim(),
            //         date: $(this).find(".wp-block-latest-comments__comment-meta time").attr("datetime"),
            //         img: $(this).find(".left img").attr("src"),
            //         rating: $(this).find(".wp-block-latest-comments__comment-excerpt .rating .active").length,
            //         comment: $(this).find(".wp-block-latest-comments__comment-excerpt p").text().trim(),
            //         replies: $('ul li').map(function () { return {
            //             name: $(this).find(".wp-block-latest-comments__comment-meta strong").text().trim(),
            //             date: $(this).find(".wp-block-latest-comments__comment-meta time").attr("datetime"),
            //             img: $(this).find(".left img").attr("src"),
            //             comment: $(this).find(".wp-block-latest-comments__comment-excerpt p").text().trim(),    
            //         } })
            //     }
            // }).get()




            // const allVersLinks = $('.entry-aside .version-card').map(function () {
            //     return 'https://apkmody.io' + $(this).find(".version-card-content a").attr("href")
            // }).get()



            // await FetchVersions(json.name , allVersLinks).then(versions => {
            //     json.versions = versions
            // }).catch(err => {
            //     reject({ message: err.message, status: err.status })
            // })  

 
             const allDescLinks = ['en' , 'vi' , 'id' , 'es' , 'pt' , 'fr']//.filter(l => l !== "vi")
             .map(l => ({ lang: l , 
              url : 
              (l === 'en') ? url :
              (l === 'vi') ? url.replace('https://apkmody.io/games' , `https://apkmody.io/${l}/game/`) :
              url.replace('apkmody.io' , `apkmody.io/${l}`) 
            }))
   
  
          //   console.log(allDescLinks);




            await FetchDescriptions(json.name , allDescLinks).then(description => {
                json.descriptions = description
            }).catch(err => {
                console.log({ message: err.message, status: err.status })
            })



        
          //  console.log(json)
            res.json({data : json})




//   await insertMovie(json).then(_res => {
//                resolve("")
//            }).catch(err => {
//                reject({ message: err.message, status: err.status })
//            })
 
            // const data = $('.container article.flex-item').map(function () {                 
            //     return {
            //         url: 'https://apkmody.io/apps' + $(this).find("a").attr('href'),
            //         apk: $(this).find(".app-tags .has-vivid-green-cyan-background-color") ? true : false,
            //         mod: $(this).find(".app-tags .has-luminous-vivid-orange-background-color") ? true : false     
            //     }
            // }).get()

            // console.log(data)

          //  res.json({status : ""})


        } else {

            res.json({status : res.statusCode})
        }
 

    })            

})




const FetchDescriptions = (name , allDescLinks) => {

    return new Promise((resolve, reject) => {

        let step = 0

        const descriptions = []
        const fileNamesOne = []
        const fileNamestwo = []

        const repeater = async ({lang , url}) => {
 
                request(url, async (err, res, body) => {

                    if (err) reject({ err })
  
                    else if (res.statusCode === 200) {
                        const $ = cheerio.load(body)
  

                        $('.content-download + .main-entry-content').find('.wp-block-buttons').remove()
                       
                        if(["en" , "vi"].includes(lang)){

                            if(lang === "en"){

                                await Promise.all($('.content-download + .main-entry-content img').map(async function (index) {
     
                                    return await downloadImage("https://apkmody.io" + $(this).attr('src'), name, lang, "descs", "jpg", (index + 1)).then(fileName => {
                                        fileNamesOne.push(fileName)    
                                        $(this).attr('src', fileName)
                                        $(this).attr('alt', name)


                                    }).catch(err => {
                                        reject({ message: err.message, status: err.status })
                                    })
     
                                }).get())
     
                              //  console.log($('.content-download + .main-entry-content').html())
    
    
                            }else{ 
    
                                 $('.content-download + .main-entry-content img').map(async function (index) {
                                    $(this).attr('src', fileNamesOne[index])
                                    $(this).attr('alt', name)

                                //    const index = fileNames.findIndex(({source}) => source === $(this).attr('src'))
                                //    if(index !== -1) $(this).attr('src', fileNames[index].fileName)
                                 }).get()
     
                            }
                        }else{ 
                            if(lang === "id"){

                                await Promise.all($('.content-download + .main-entry-content img').map(async function (index) {
    
                                    return await downloadImage("https://apkmody.io" + $(this).attr('src'), name, lang, "descs", "webp", (index + 1)).then(fileName => {
                                    
                                       fileNamestwo.push(fileName)    
                                        $(this).attr('src', fileName)
                                        $(this).attr('alt', name)
                                        

                                    }).catch(err => {
                                        reject({ message: err.message, status: err.status })
                                    })
     
                                }).get())
         
                            }else{ 
    
                                 $('.content-download + .main-entry-content img').map(async function (index) {
                                    $(this).attr('src', fileNamestwo[index])
                                    $(this).attr('alt', name)

                                 }).get()
    
                            }
                          
                        }
                 

                        $('.content-download + .main-entry-content a').map(async function () {
                             const link = $(this).attr('href').replace("https://apkmody.io/" + lang , "")
                             const text = $(this).text()
                             $(this).replaceWith(`<Link href="${link}">${text}</Link>`)
                         }).get()


                        descriptions.push({
                            lang: lang,
                            text: $('.content-download + .main-entry-content').html()
                        })




                        if ((step + 1) >= allDescLinks.length) {
                            resolve(descriptions)
                        } else {
                            step++
                            await repeater(allDescLinks[step])
                        }

                    } else {
                        reject({ message: "fetch description", status: res.statusCode })
                    }
                })

            
        }

        repeater(allDescLinks[step])

    })
}



const FetchVersions = (name , allVersLinks) => {

    return new Promise((resolve, reject) => {

        let step = 0

        const versions = []

        const repeater = async (url) => {

            if (step >= allVersLinks.length) {
                resolve(versions)
            } else {

                request(url, async (err, res, body) => {

                    if (err) reject({ err })
                    else if (res.statusCode === 200) {

                         const $ = cheerio.load(body)

                         let text =  $("h1 + span.has-text-align-center.truncate").text().trim()

                        if (text) {

                         let version = /[0-9]+(\.[0-9]+)+$/.exec($('.app-name h1 span').text().trim())[0]
                         let icon = 'https://apkmody.io' + $(".app-icon img").attr("src")

                            await downloadImage(icon, name, version, "icons").then(fileName => {

                                versions.push({
                                    version: version,
                                    icon: fileName,
                                    size: $(".response-download-btn a").text().trim().split(' ')[1],
                                    text: text,
                                    link: $(".response-download-btn a").attr("href"),
                                })


                            }).catch(err => {
                                reject({ message: err.message, status: err.status })
                            })


                        
                        }

                        step++
                        await repeater(allVersLinks[step])


                    } else {
                        reject({ message: "fetch versions", status: res.statusCode })
                    }
                })

            }
        }

        repeater(allVersLinks[step])

    })
}
 
 
const downloadImage = (url, name, version, prefex , extension, index) => {

    return new Promise(async (resolve, reject) => {

        const fileName = `${name}_${version}.${extension}`
        const dest = `./public/images/${prefex}`
        const path = `${dest}/${index}_${fileName}`
        let counter = 0

        const repeater = () => {

            console.log(`Download Image => (${index}) (${counter}) : ${name} =>(${fileName})`);

            if (counter >= 50) {
                reject({ message: "downloadImage", status: 400 })
            } else {

                //file exists
                if (fs.existsSync(path)) {
                    fs.unlink(path, err => {
                        if (err) reject({ message: "downloadImage => unlink", status: 400 })
                    });
                }

 
                const file = fs.createWriteStream(path);
                const sendReq = request.get(url);

                sendReq.on('response', async (res) => {
                    if (res.statusCode === 200) {
              
                        console.log(`Download Image => ${prefex}/ ${name} (${version})`);

                        resolve(path)
                        // resolve(res.statusCode)
                        // await insertFile(fileName).then(id => {
                        //     console.log(`Insert Image => ${prefex}/ ${name} (${version})`);
                        //     resolve(id)
                        // }).catch(err => {
                        //     reject({ message: err.message, status: err.status })
                        // })

                    } else if (res.statusCode === 503) {
                        repeater()
                    }
                    counter++
                });

                sendReq.pipe(file);

                file.on('finish', () => {
                    file.close()
                });

                sendReq.on('error', (err) => {
                    fs.unlink(path, () => {
                        counter++
                        console.log(`Req : Image ${prefex} => name : ${name} (${version})`);
                        // // repeater()
                        resolve(null)
                    }); 
                });

                file.on('error', (err) => {
                    fs.unlink(path, () => {
                        //counter++
                        console.log(`File : Image ${prefex} => name : ${name} (${version})`);
                        //  repeater()
                        resolve(null)
                    });
                });

            }


        }

       repeater()

    })
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////


















// const Movies = require("../routers/movies")
// const Series = require("../routers/series")
// const Sessions = require("../routers/sessions")
// const Episodes = require("../routers/episodes")

// app.use(ApiEndpoints.Movies.route, Movies)
// app.use(ApiEndpoints.Series.route, Series)
// app.use(ApiEndpoints.Sessions.route, Sessions)
// app.use(ApiEndpoints.Episodes.route, Episodes)

app.use((req, res, next) => {
    res.status(404).json("Api not found") 
})


app.listen(process.env.PORT || 3000 , () => {
    console.log("server start")
})












