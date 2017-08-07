/* global $, Stripe, stripeResponseHandler */
//Document ready
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form'),
      submitBtn = $('#form_signup_btn');
  
  //Set Stripe public key
  Stripe.setPublishableKey( $('meta[name="stripe-key"').attr('content') );
  
  //Prevent default submission when
  //users clicks submit btn
  submitBtn.click(function(event){
    event.preventDefault()
    submitBtn.val("Processing").prop('disabled', true)
    
    //Collect credit card fields
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(), 
        expYear = $('#card_year').val();
        
    //Use Stripe JS library for validation
    var error = false;
    
    //Validate card number
    if(!Stripe.card.validateCardNumber(ccNum)){
      var error = true;
      alert('The credit card number appears to be invalid')
    }
    
    //Validate CVC number
    if(!Stripe.card.validateCVC(cvcNum)){
      var error = true;
      alert('The CVC number appears to be invalid')
    }
    
    //Validate expiration number
    if(!Stripe.card.validateExpiry(expMonth, expYear)){
      var error = true;
      alert('The expiration date appears to be invalid')
    }
        
    if(error){
      submitBtn.prop('disabled', false).val('Sign Up')
    } else {
      //Send the card informaton to Stripe
      Stripe.createToken({
        number: ccNum, 
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
    return false
  });
  
  //Stripe will return a card token
  function stripeResponseHandler(status, response){
    //Get the token from the response
    var token = response.id;
    
    //Inject the card token in a hidden field
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
    
    //Submit our form to a Rails app
    theForm.get(0).submit();
    
  }

  //Stripe will return back a card token
  //Inject card token as hidden field into form
  //Submit form into rails app
});
