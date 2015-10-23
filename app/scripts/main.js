(function($){ $(document).ready(function(){
  var $form = $('form');
  var allergies = {
    'dairy':    '396^Dairy-Free',
    'egg':      '397^Egg-Free',
    'gluten':   '393^Gluten-Free',
    'peanut':   '394^Peanut-Free',
    'seafood':  '398^Seafood-Free',
    'sesame':   '399^Sesame-Free',
    'soy':      '400^Soy-Free',
    'sulfite':  '401^Sulfite-Free',
    'tree nut': '395^Tree Nut-Free',
    'wheat':    '392^Wheat-Free'
  };
  var diets = {
    'paleo':                '403^Paleo',
    'pescetarian':          '390^Pescetarian',
    'vegetarian':           '387^Lacto-ovo vegetarian',
    'lacto vegetarian':     '388^Lacto vegetarian',
    'ovo vegetarian':       '389^Ovo vegetarian',
    'vegan':                '386^Vegan'
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
  
  function getQ () {
    return $('input[type="text"]').val();
  }

  function prepareDayType() {
    var isOrange = $form.find('input[name="day"]:checked').val() === 'orange' ? true : false;
    
    if (isOrange) {
      return makeParam('nutrition.carbs', '10 g/serving');
    } else {
      return makeParam('nutrition.carbs', '90 g/serving');
    }
  }

  function makeParam (key, val) {
    return key + '=' + encodeURIComponent(val);
  }

  function allergiesParams () {
    var params = [];
    
    for (var key in allergies) {
      if(allergies.hasOwnProperty(key)){
        var id = key.replace(' ','-');
        if ($form.find('#'+id+':checked').length > 0) {
          params.push( makeParam('allowedAllergy',allergies[key]) )
        }
      }
    }
    return params;
  }

  function dietsParams () {
    var params = [];
    
    for (var key in diets) {
      if(diets.hasOwnProperty(key)){
        var id = key.replace(' ','-');
        if ($form.find('#'+id+':checked').length > 0) {
          params.push( makeParam('allowedDiet',diets[key]) )
        }
      }
    }
    return params;
  }

  function populateAllergies () {
    for (var key in allergies) {
      if(allergies.hasOwnProperty(key)){
        var id = key.replace(' ','-');
        var text = toTitleCase(key);
        var html = '<label for="'+ id +'"><input type="checkbox" id="'+ id +'"> '+ text +'</label>';
        $form.find('#allergies-fieldset').append(html);
      }
    }
  }

  function populateDiets () {
    for (var key in diets) {
      if(diets.hasOwnProperty(key)){
        var id = key.replace(' ','-');
        var text = toTitleCase(key);
        var html = '<label for="'+ id +'"><input type="checkbox" id="'+ id +'"> '+ text +'</label>';
        $form.find('#diets-fieldset').append(html);
      }
    }
  }

  function extraParams () {
    var params = [];
    
    // each necessary parameter (or set of them)
    params.push( makeParam( 'q', getQ() ) );
    params.push( prepareDayType() );

    // never sugar...
    params.push( makeParam('excludedIngredient', 'sugar') );

    // no User Profile Settings interference
    params.push( makeParam('noUserSettings','true') );

    // Allergies?
    $.each(allergiesParams(), function(i, param){
      params.push(param);
    });
    
    // Dietary restrictions?
    $.each(dietsParams(), function(i, param){
      params.push(param);
    });
    
    return params.join('&');
  }

  populateAllergies()
  populateDiets()

  $form.on('submit', function(e){
    e.preventDefault();
    
    var url = '//yummly.com/recipes?';
    var params = extraParams();

    url += params;

    console.log(url)
    
    if ( $form.find('#open-in-new:checked').length > 0 ) {
      window.open(url);
    } else {
      window.location = url;
    }
  })

  $form.find('fieldset#day-fieldset input').on('change', function(){
    var $checkboxes = $(this).closest('fieldset').find('input');
    var $checked = $checkboxes.filter(':checked');
    var isProteinDay = $checked.val() === 'orange' ? true : false ;
    $checkboxes.parent().removeClass('active');
    $checked.parent().addClass('active');
    if (isProteinDay) {
      $(this).closest('form').removeClass('carb-day').addClass('protein-day');
    } else {
      $(this).closest('form').removeClass('protein-day').addClass('carb-day');
    }
  });

}); })(jQuery)