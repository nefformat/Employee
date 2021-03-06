CREATE DATABASE [employeesdb]
GO
USE [employeesdb]
GO
/****** Object:  Table [dbo].[employees]    Script Date: 07.04.2020 23:45:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[employees](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Department] [nvarchar](100) NULL,
	[Position] [nvarchar](100) NULL,
	[ManagerId] [int] NULL,
	[StartDate] [date] NOT NULL,
 CONSTRAINT [PK_employees] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  StoredProcedure [dbo].[AddEmployee]    Script Date: 07.04.2020 23:45:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[AddEmployee]
	@name nvarchar(100),
	@department nvarchar(100),
	@position nvarchar(100),
	@managerId int,
	@startDate date

AS
BEGIN
	SET NOCOUNT ON;
INSERT
INTO
    employees
	 ([Name], Department, Position, ManagerId, StartDate)
VALUES
(@name, @department, @position, @managerId, @startDate)
END
GO
/****** Object:  StoredProcedure [dbo].[EmployeesCount]    Script Date: 07.04.2020 23:45:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[EmployeesCount]
AS
BEGIN
	SET NOCOUNT ON;
	SELECT COUNT(*) AS EmployeesCount FROM dbo.employees;
END
GO
/****** Object:  StoredProcedure [dbo].[GetById]    Script Date: 07.04.2020 23:45:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetById]
@id int
AS
BEGIN

	SET NOCOUNT ON;

	SELECT * from employees WHERE id = @id ORDER By ID OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY
END
GO
/****** Object:  StoredProcedure [dbo].[GetByName]    Script Date: 07.04.2020 23:45:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetByName]
	@name nvarchar(100)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * from employees WHERE [name]= @name ORDER By ID OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY
END
GO
/****** Object:  StoredProcedure [dbo].[GetEmployees]    Script Date: 07.04.2020 23:45:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetEmployees]
	-- Add the parameters for the stored procedure here
	@take int,
	@skip int
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM employees Order by id OFFSET (@skip) ROWS FETCH NEXT (@take) ROWS ONLY
END
GO
/****** Object:  StoredProcedure [dbo].[GetHierarchy]    Script Date: 07.04.2020 23:45:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetHierarchy]
	@EmployeeId int
AS
BEGIN
	SET NOCOUNT ON;

	CREATE TABLE #Managers(id int not null, [Name] nvarchar(100) not null, SubCount int not null)

	WHILE @EmployeeId IS NOT NULL
	BEGIN
		SET @EmployeeId = (SELECT e.ManagerId FROM employees AS e WHERE e.Id = @EmployeeId)
		IF @EmployeeId IS NOT NULL
			INSERT INTO #Managers SELECT e.id, e.[Name], (SELECT COUNT(Id) FROM employees AS e WHERE e.ManagerId = @EmployeeId) FROM employees AS e WHERE e.Id = @EmployeeId
	END
	
	SELECT * FROM #Managers
	DROP TABLE #Managers
END
GO
/****** Object:  StoredProcedure [dbo].[GetListByName]    Script Date: 07.04.2020 23:45:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetListByName]
	@name nvarchar(100),
	@take int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * from employees WHERE [name] LIKE '%' + @name+'%' ORDER By ID OFFSET 0 ROWS FETCH NEXT @take ROWS ONLY
END
GO
/****** Object:  StoredProcedure [dbo].[RemoveById]    Script Date: 07.04.2020 23:45:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[RemoveById]
	@id int
AS
BEGIN
	SET NOCOUNT ON;

BEGIN TRANSACTION
	UPDATE
		employees
	SET 
		ManagerId = null
	WHERE
		ManagerId = @id

	DELETE
	FROM
		employees
	WHERE
		id = @id

COMMIT
	END
GO

