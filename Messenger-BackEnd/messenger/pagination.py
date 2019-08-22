class CustomPagination(pagination.PageNumberPagination):
    def paginate_queryset(self, queryset, request, view=None):
        raw_date_get = self.request.query_params.get('user-name', None)
        # if the user doesnt specify a date get param use that else user
        if raw_date_get:


    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'results': data
        })