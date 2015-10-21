import $ from 'jquery';

var model = {
    saveFile: (data) => {
        return $.ajax({
            url: '/savefile',
            type: 'post',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json'
        })
            .then((...all) => {
                console.log(all);
            }, (...all) => {
                console.log(all);
            });
    }
};

export default model;