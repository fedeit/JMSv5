<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>Final Reviews - YSJ</title>
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i">
    <link rel="stylesheet" href="assets/fonts/fontawesome-all.min.css">
    <link rel="stylesheet" href="assets/fonts/font-awesome.min.css">
    <link rel="stylesheet" href="assets/fonts/fontawesome5-overrides.min.css">
</head>

<body id="page-top">
    <div id="wrapper">
        <%- include('sidebar.ejs', {authLevel: authLevel, page: 'final_reviews'}) %>
        <div class="d-flex flex-column" id="content-wrapper">
            <div id="content">
                <%- include('navbar.ejs') %>
            <div class="container-fluid">
                <h3 class="text-dark mb-4">Archive</h3>
                <div class="card shadow">
                    <div class="card-header py-3">
                        <p class="text-primary m-0 font-weight-bold">Completed - <%=articles.length%> total</p>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 text-nowrap">
                                <div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
                                    <select class="form-control form-control-sm custom-select custom-select-sm" style="width: 114px;margin: 0 20px 0 10px;" id="subjectsFilterSelector" onChange="filterBy()">
                                        <option value="" selected="">Any Subject</option>
                                        <% for(let i = 0; i < subjects.length; i++) { %>
                                            <option value="<%=subjects[i]%>"><%=subjects[i]%></option>
                                        <% } %>
                                    </select>
                                    <select class="form-control form-control-sm custom-select custom-select-sm" style="width: 150px;margin: 0 20px 0 10px;" id="typesFilterSelector" onChange="filterBy()">
                                        <option value="" selected="">Any Type</option>
                                        <% for(let i = 0; i < types.length; i++) { %>
                                            <option value="<%=types[i]%>"><%=types[i]%></option>
                                        <% } %>
                                    </select>&nbsp;</label><label></label></div>
                            </div>
                            <div class="col-md-6">
                                <div class="text-md-right dataTables_filter" id="dataTable_filter">
                                    <input id="filterSearch" type="search" class="form-control form-control-sm" aria-controls="dataTable" placeholder="Search" style="width: 100%;">
                                    <label></label>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive table mt-2" id="dataTable" role="grid" aria-describedby="dataTable_info">
                            <table class="table dataTable my-0" id="dataTable">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th width="150px">Date</th>
                                        <th>Type</th>
                                        <th>Subject</th>
                                        <th>Author</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <% for(let i = 0; i < articles.length; i++) { %>
                                    <tr class="articleRows">
                                        <td class="articleRowSearch"><%=articles[i].title%></td>
                                        <td class="articleRowSearch"><%=articles[i].timestamp%></td>
                                        <td class="typesFilterCol"><%=articles[i].type%></td>
                                        <td class="subjectsFilterCol"><%=articles[i].subject%></td>
                                        <td class="articleRowSearch"><%=articles[i].author%></td>
                                        <td> <a class="btn btn-info btn-circle ml-1" role="button" href="article_overview?id=<%=articles[i].id%>&archive=true"><i class="fas fa-info-circle text-white"></i></a></td>
                                    </tr>
                                    <% } %>
                                    <tr></tr>
                                </tbody>
                                <tfoot>
                                    <tr></tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="bg-white sticky-footer">
            <div class="container my-auto">
                <div class="text-center my-auto copyright"><span>Copyright © YSJ 2020</span></div>
            </div>
        </footer>
    </div><a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a></div>
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/js/chart.min.js"></script>
    <script src="assets/js/bs-init.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.js"></script>
    <script src="assets/js/theme.js"></script>
    <script type="text/javascript">
        // Filtering functions here
        function filterBy() {
            let searchFilter = document.getElementById("filterSearch").value;
            if (currentFilter("subjectsFilterSelector") == "" &&
                currentFilter("typesFilterSelector") == "" &&
                searchFilter == "") {
                    resetFilterRows();
            } else {
                let rows = document.getElementsByClassName("articleRows");
                for (var i = rows.length - 1; i >= 0; i--) {
                    rows[i].style.display = "none";
                    if ( articleFiltered(rows[i], "subjectsFilterCol", currentFilter("subjectsFilterSelector")) &&
                         articleFiltered(rows[i], "typesFilterCol", currentFilter("typesFilterSelector")) &&
                         articleFilteredBySearch(rows[i])) {
                        rows[i].style.display = "";
                    }
                }
            }
        };


        function articleFilteredBySearch(row) {
            let selectedFilter = document.getElementById("filterSearch").value;
            if (selectedFilter == "") { return true; }
            let rowInfo = row.getElementsByClassName("articleRowSearch");
            let queryStr = "";
            for (var j = rowInfo.length - 1; j >= 0; j--) {
                queryStr += rowInfo[j].innerHTML + " ";
            }
            if (queryStr.toLowerCase().indexOf(selectedFilter.toLowerCase()) !== -1) {
                return true;
            } else {
                return false;
            }
        };

        function articleFiltered(row, column, filter) {
            let col = row.getElementsByClassName(column)[0].innerHTML;
            col = col.replace("&amp;", "&");
            console.log(col, filter);
            if (filter == "" || col == filter) {
                return true;
            } else {
                return false;
            }
        };

        function currentFilter(selectorName) {
            let deptFilter = document.getElementById(selectorName);
            let filter = deptFilter.options[deptFilter.selectedIndex].value;
            return filter;
        };

        function resetFilterRows() {
            let rows = document.getElementsByClassName("articleRows");
            for (var i = rows.length - 1; i >= 0; i--) {
                rows[i].style.display = "";
            }
        };

        document.getElementById("filterSearch").addEventListener('input', function() {
            filterBy();
        });
    </script>
</body>

</html>