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
            .then(({url: url}) => {
                return url
            }, (...all) => {
                console.log('file upload error', all);
            });
    }
};

export default model;