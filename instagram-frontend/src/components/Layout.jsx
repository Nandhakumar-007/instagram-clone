import Sidebar from "./Sidebar";


function Layout({children}){

    return(

        <div className="app-layout">

            <Sidebar />

            <main className="content">

                {children}

            </main>

        </div>

    )

}


export default Layout;