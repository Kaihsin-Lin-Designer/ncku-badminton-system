const AuthLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
    return(
        <main
            className="bg-neutral-200"
        >
            <div className="container min-h-lvh flex items-center justify-center">
                {children}
            </div>
        </main>
    )
}

export default AuthLayout