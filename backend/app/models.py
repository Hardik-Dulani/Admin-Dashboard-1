# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class MyData(models.Model):
    id =  models.AutoField(null=False,primary_key=True)
    end_year = models.CharField(max_length=255, blank=True, null=True)
    intensity = models.CharField(max_length=255, blank=True, null=True)
    sector = models.CharField(max_length=255, blank=True, null=True)
    topic = models.CharField(max_length=255, blank=True, null=True)
    insight = models.CharField(max_length=500, blank=True, null=True)
    url = models.CharField(max_length=500, blank=True, null=True)
    region = models.CharField(max_length=255, blank=True, null=True)
    start_year = models.CharField(max_length=255, blank=True, null=True)
    impact = models.CharField(max_length=255, blank=True, null=True)
    added = models.CharField(max_length=255, blank=True, null=True)
    published = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    relevance = models.CharField(max_length=255, blank=True, null=True)
    pestle = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=500, blank=True, null=False)
    likelihood = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        managed = False
        db_table = 'my_data'
        
