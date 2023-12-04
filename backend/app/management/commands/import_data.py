import json
from django.core.management.base import BaseCommand
from app.models import MyData

class Command(BaseCommand):
    help = 'Import data from a JSON file into PostgreSQL'

    def handle(self, *args, **options):
        
        with open(r'C:\Users\Hardik\Dashboard-fs\data\jsondata.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
    
        for item in data:
            
            
            MyData.objects.create(**item)

        self.stdout.write(self.style.SUCCESS('Data imported successfully!'))