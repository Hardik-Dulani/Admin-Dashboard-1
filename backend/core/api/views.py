from django.http import JsonResponse
from ..models import MyData

def get_data(request):
    data = MyData.objects.values()
    converted_data = []
    for item in data:
        if item['end_year']:
            item['end_year'] = int(item['end_year'])
        if item['intensity']:
            item['intensity'] = float(item['intensity'])
        if item['relevance']:
            item['relevance'] = int(item['relevance'])
        if item['likelihood']:
            item['likelihood'] = int(item['likelihood'])
        if item['start_year']:
            item['start_year'] = int(item['start_year'])
        if item['impact']:
            item['impact'] = float(item['impact'])
        
        converted_data.append(item)
    return JsonResponse({'data': list(data)})