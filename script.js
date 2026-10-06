// Wait for the web page to load
document.addEventListener("DOMContentLoaded", () => {
    console.log("App loaded successfully on localhost!");

    // Example 1: Handle button click
    const shopButton = document.getElementById("shop-btn");
    if (shopButton) {
        shopButton.addEventListener("click", () => {
            alert("Redirecting to the Shop section!");
            // You can also navigate to another page:
            // window.location.href = "page2.html";
        });
    }
});