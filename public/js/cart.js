updateTotal();
emptyBag();

$(".add-quan").click(function() {
        updateQuan("add", $(this));
});

$(".rm-quan").click(function() {
        quan = $(this).parents(".cart-quan-selector").children(".product-quantity-cart").val();
        if (quan != 1) {
                updateQuan("minus", $(this));
        }
});

$(".rm-cart").click(function () {
        $(this).parents(".cart-item").remove();
        updateTotal();
        /* update bag */
        cartSize = $(".cart-size").text();
        $(".cart-size").text(--cartSize); //
        emptyBag();
});

$(".check-out").click(function () {
        $("#order-form").submit();
});

$(".discount-btn").click(function () {
        discount = $("#discount").val();
        if ((discount > 0) && !emptyBag()) {
                $(".discount-amount-container").show();
                $(".discount-amount").text(discount);
                updateTotal();
        }
});

$(".rm-discount").click(function () {
        $(".discount-amount-container").hide();
        $("#discount").val('');
        updateTotal();
});

function updateQuan(option, elem) {
        quan_elem = elem.parents(".cart-quan-selector").children(".product-quantity-cart");
        quan = elem.parents(".cart-quan-selector").children(".product-quantity-cart").val();

        if (option == "add") {
                quan_elem.val(++quan);
        } else {
                quan_elem.val(--quan);
        }

        unit_price = elem.parents(".cart-item-info").children(".item-title").children(".product-unit-price").val();
        price_elem = elem.parents(".cart-item-info").children(".item-title").children(".cart-item-price");
        updatePrice = unit_price * quan;
        price_elem.text(updatePrice);
        updateTotal();
}

function updateTotal() {
        pricesArr = document.getElementsByClassName("cart-item-price");
        discount = $("#discount").val();

        var total = 0;
        for (price = 0; price < pricesArr.length; price++) {
                total += parseInt((pricesArr[price]).innerText);
        }

        if (discount > 0) {
                total -= discount;
        }

        $(".subtotal").text(total);
        $(".total").text(total);
        
}

function emptyBag() {
        cartSize = $(".cart-size").text();
        if (cartSize == 0) {
                $(".empty-cart").css("display", "inline");
                return true;
        }

        return false;
}