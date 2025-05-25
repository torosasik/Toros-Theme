(function(window, $) {
  $(function() {
    console.log('✅ V2: Starting overage calculator V2');
    var tags = window.torosOverageV2.productTags || [];
    if (!tags.includes('overage-popup-v2')) return;
    var atcBtn = $('#atc-btn-wrap button[name="add"]');
    if (!atcBtn.length) {
      atcBtn = $('[data-add-to-cart], button[name=add]');
    }
    if (!atcBtn.length) {
      console.error('⚠️ V2: Add to Cart button not found');
      return;
    }
    // Create overlay and popup if not exists
    if (!$('#v2-overage-overlay').length) {
      var overlayHtml = '\
<div id="v2-overage-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:none;align-items:center;justify-content:center;z-index:9999;">\
  <div id="v2-overage-popup" style="background:#fff;padding:20px;border-radius:8px;max-width:90%;width:400px;position:relative;">\
    <h2>Calculate Overage</h2>\
    <label style="display:block;margin-top:10px;">Square Footage:<br><input type="number" id="v2-sqft" style="width:100%;margin-top:5px;"></label>\
    <label style="display:block;margin-top:10px;">Overage:<br><select id="v2-overage-select" style="width:100%;margin-top:5px;">\
      <option value="0">None</option>\
      <option value="0.1">10%</option>\
      <option value="0.15">15%</option>\
      <option value="custom">Custom</option>\
    </select></label>\
    <input type="number" id="v2-custom-overage" placeholder="Enter decimal (e.g. 0.12)" style="width:100%;margin-top:5px;display:none;">\
    <button id="v2-calc-btn" style="margin-top:15px;">Calculate</button>\
    <div id="v2-calc-result" style="margin-top:10px;"></div>\
    <button id="v2-add-cart-btn" style="margin-top:10px;">Add to Cart</button>\
    <button id="v2-close-btn" style="position:absolute;top:10px;right:10px;">×</button>\
  </div>\
</div>';
      $('body').append(overlayHtml);
    }
    var overlay = $('#v2-overage-overlay');
    console.log('✅ V2: Overlay created');
    // Event handlers
    $('#v2-overage-select').on('change', function() {
      if (this.value === 'custom') $('#v2-custom-overage').show();
      else $('#v2-custom-overage').hide();
    });
    $('#v2-calc-btn').on('click', function() {
      var sqft = parseFloat($('#v2-sqft').val());
      var sel = $('#v2-overage-select').val();
      var overage = sel === 'custom' ? parseFloat($('#v2-custom-overage').val()) : parseFloat(sel);
      if (isNaN(sqft) || isNaN(overage)) {
        $('#v2-calc-result').text('Please enter valid numbers.');
        return;
      }
      var boxes = Math.ceil(sqft / window.torosOverageV2.boxArea * (1 + overage));
      $('#v2-calc-result').text('You need ' + boxes + ' boxes');
      $('#v2-add-cart-btn').data('qty', boxes);
    });
    $('#v2-add-cart-btn').on('click', function() {
      var qty = $(this).data('qty');
      if (!qty) {
        $('#v2-calc-result').text('Calculate first.');
        return;
      }
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {id: window.torosOverageV2.firstVariantId, quantity: qty},
        dataType: 'json',
        success: function() {
          window.location.href = '/cart';
        },
        error: function() {
          console.error('⚠️ V2: Failed to add to cart');
        }
      });
    });
    overlay.on('click', function(e) {
      if (e.target.id === 'v2-overage-overlay' || e.target.id === 'v2-close-btn') {
        overlay.hide();
      }
    });
    atcBtn.on('click', function(e) {
      e.preventDefault();
      overlay.show().css('display', 'flex');
    });
    console.log('✅ V2: Event listeners attached');
  });
})(window, jQuery); 