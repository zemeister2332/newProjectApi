$(document).ready(() => {
    $('.music-delete').on('click', (e) => {
       $target = $(e.target);
       const id = $target.attr('data-id');
       $.ajax({
          type: 'DELETE',
          url: '/musics/'+id,
           success: (response) => {
               alert('Musiqa O\'chirib Tashlandi !');
               window.location.href='/';
           },
           error: (err) => {
               console.log(err)
           }
       });
    });
});