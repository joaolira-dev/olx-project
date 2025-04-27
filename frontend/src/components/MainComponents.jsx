

export const Template = ({ children }) => {
   return (
      <div>
         {children}
      </div>
   )
}

export const ErrorMessage = ({children}) => {
   return(
      <div className="ErrorMessage">
         {children}
      </div>
   )
}

export const PageTitle = ({children}) => {
   return(
      <h1 className="PageTitle">{children}</h1>
   )
}

export const PageArea = ({ children, className = "" }) => {
   return (
     <div className={`PageArea ${className}`.trim()}>
       {children}
     </div>
   );
 };

export const PageContainer = ({ children, className = "" }) => {
   return (
     <div className={`PageContainer ${className}`.trim()}>
       {children}
     </div>
   );
 };
 

export const SearchArea = ({children}) => {
   return (
      <div className="SearchArea">
         {children}
      </div>
   )
}

export const Fake = ({children, height, className}) => {
   return (
      <div className={className} style={{ height }}>  
         {children}
      </div>
   )
}

export const BreadCrumb = ({ children, className = "" }) => {
   return (
     <div className={`BreadCrumb ${className}`.trim()}>
       {children}
     </div>
   );
 };