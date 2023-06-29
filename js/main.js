(function () {

    'use strict'

    var file = document.getElementById('subirPersonaje');
    //var preload = document.querySelector('.preload');
    var publish = document.getElementById('publish');
    var formData = new FormData();

    file.addEventListener('change', function (e) {

        for ( var i = 0; i < file.files.length; i++ ) {
            var thumbnail_id = Math.floor( Math.random() * 30000 ) + '_' + Date.now();
            createThumbnail(file, i, thumbnail_id);
            formData.append(thumbnail_id, file.files[i]);
        }

        e.target.value = '';

    });

    publish.addEventListener('click', function (e) {
        e.preventDefault();

        var xhr = new XMLHttpRequest();
        var url = 'http://localhost:3000/uploadImages';

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    //preload.classList.remove('activate-preload');
                    clearFormDataAndThumbnails();
                    document.getElementById('success').innerText = data.message;
                    console.log(data)
                } else {
                    console.log('Error en la petición');
                }
            }
        };
        xhr.open('POST', url, true);

        xhr.onerror = function (err) {
            console.log(err);
        };

        xhr.send(formData);
    });
//equivalente de AJAX para enviar al servidor (en mi caso nodeJS con express)

    var createThumbnail = function (file, iterator, thumbnail_id) {
        var thumbnail = document.createElement('div');
        //const clasesThumbnail = ['col-3','align-items-center','border']
        thumbnail.classList.add('col-3','align-items-center','border', thumbnail_id);
        thumbnail.dataset.id = thumbnail_id;
        thumbnail.setAttribute('style', `background-image: url(${ URL.createObjectURL( file.files[iterator] ) }); width: 100px; height: 100px`);
        thumbnail.style.backgroundSize = '100px 100px';
        //thumbnail.setAttribute('style', 'width: 100px');
        //thumbnail.setAttribute('style', 'height: 100px');
        document.getElementById('contenedorImagenes').appendChild(thumbnail);
        createCloseButton(thumbnail_id);
    }

    var createCloseButton = function (thumbnail_id) {
        var closeButton = document.createElement('div');
        closeButton.classList.add('btn-close');
        //closeButton.innerText = 'x';
        document.getElementsByClassName(thumbnail_id)[0].appendChild(closeButton);
    }

    var clearFormDataAndThumbnails = function () {
        for ( var key of formData.keys() ) {
            formData.delete(key);
        }

        document.querySelectorAll('.thumbnail').forEach(function (thumbnail) {
            thumbnail.remove();
        });
    }

    document.body.addEventListener('click', function (e) {
        if ( e.target.classList.contains('btn-close') ) {
            e.target.parentNode.remove();
            formData.delete(e.target.parentNode.dataset.id);
        }
    });

})();