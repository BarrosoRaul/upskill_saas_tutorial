/* global $, Stripe, stripeResponseHandler */
//Document ready
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form'),
      submitBtn = $('#form_submit_btn');
  
  //Set Stripe public key
  Stripe.setPublishableKey( $('meta[name="stripe-key"').attr('content') );
  
  //Prevent default submission when
  //users clicks submit btn
  submitBtn.click(function(event){
    event.preventDefault()
    
    //Collect credit card fields
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(), 
        expYear = $('#card_year').val();
        
    //Send the card informaton to Stripe
    Stripe.createToken({
      number: ccNum, 
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
    }, stripeResponseHandler);
  });
  

  //Stripe will return back a card token
  //Inject card token as hidden field into form
  //Submit form into rails app
});
