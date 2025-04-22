
// Education Year of Study
$(document).ready(function() {
    let credentialCounter = 2;
    const startYear = 1920;
    const currentYear = new Date().getFullYear();

    const $startSelect = $('#start_year');
    const $endSelect = $('#end_year');

    for (let year = currentYear; year >= startYear; year--){
        const option = `<option value="${year}">${year}</option>`;
        $startSelect.append(option)
        $endSelect.append(option)
    }
    

    $('#add-education-btn').on('click', function (e) {
        e.preventDefault();
        console.log("add-education-btn clicked");
    
        const $lastEntry = $('.education_entry').last();
        const $clone = $lastEntry.clone();
    

        $clone.attr('data-credential-id', credentialCounter);
        $clone.find('form')[0].reset();
        $clone.find('input[type="file"]').val('');
        

        $clone.find('.form-group').first().before('<hr>');

    
        $('.education-wrapper').append($clone);
        credentialCounter++;
    });
})
