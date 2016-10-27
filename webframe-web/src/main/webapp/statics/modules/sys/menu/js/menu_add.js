$(document).ready(
    function() {
        $("#inputForm")
            .validate(
            {
                ignore: "",
                submitHandler : function(form) {
                    form.submit();
                },
                errorContainer : "#messageBox",
                errorPlacement : function(error, element) {
                    if (element.is(":checkbox")
                        || element.is(":radio")
                        || element.parent().is(
                            ".input-append")) {
                        error.appendTo(element.parent()
                            .parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
    });