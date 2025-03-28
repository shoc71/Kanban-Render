import React from "react";

function PageWrapper({children}) {
    return (
        <main id="main-content" tabIndex="-1">
            {children}
        </main>
    );
}

export default PageWrapper;