const token = "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"
const readFile = (storename) => {
    let config = {
        method: 'get',
        url: `https://api.github.com/repos/mohamed1408/new_year_orders/contents/${storename}-orders.json`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    return axios(config)
}
const deleteFile = (storename, sha) => {
    let config = {
        method: 'delete',
        url: `https://api.github.com/repos/mohamed1408/new_year_orders/contents/${storename}-orders.json`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "message": "deleteing file",
            "sha": sha
        })
    }
    return axios(config)
}
const createFile = (storename, orders) => {
    let config = {
        method: 'put',
        url: `https://api.github.com/repos/mohamed1408/new_year_orders/contents/${storename}-orders.json`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "message": `${storename} orders`,
            "content": `${Buffer.from(JSON.stringify(orders)).toString('base64')}`
        })
    }
    return axios(config)
}
const githubApi = "https://api.github.com/repos/mohamed1408/new_year_orders/contents/"

//////////////////////NEW YEAR SPECIAL///////////////////////
app.get('/uploadOfllineOrders', function (req, res) {
    let storename = req.query.storename
    db.pendingorders.find({}, (oerr, orders) => {
        readFile(storename)
            .then(rres => {
                console.log("file available", rres.data.sha)
                deleteFile(storename, rres.data.sha)
                    .then(dres => {
                        console.log("file deleted")
                        createFile(storename, orders)
                            .then(cres => {
                                console.log("file created")
                                res.send(cres.data)
                            })
                            .catch(cerr => {
                                console.log("file not created")
                                res.send(cerr)
                            })
                    })
                    .catch(derr => {
                        console.log("file not deleted")
                        res.send(derr)
                    })
            })
            .catch(rerr => {
                console.log("file not available")
                console.log(rerr)
                createFile(storename, orders)
                    .then(cres => {
                        console.log("file created")
                        res.send(cres.data)
                    })
                    .catch(cerr => {
                        console.log("file not created")
                        res.send(cerr)
                    })
            })
    })
})
