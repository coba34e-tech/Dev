import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { toast } from "../hooks/use-toast";
import { Copy, Plus, Search, Trash2, Download, Wand2 } from "lucide-react";
import {
  getProducts, createProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct,
  getCampaigns, createCampaign as apiCreateCampaign, updateCampaign as apiUpdateCampaign, deleteCampaign as apiDeleteCampaign,
  getCoupons, createCoupon as apiCreateCoupon, updateCoupon as apiUpdateCoupon, deleteCoupon as apiDeleteCoupon,
  getUtmLinks, createUtmLink, getClicks, getMetrics, exportCSVUrl
} from "../lib/api";

const SectionHeader = ({ title, extra }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
    <div className="flex items-center gap-2">{extra}</div>
  </div>
);

export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const [query, setQuery] = useState("");

  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [utmLinks, setUtmLinks] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [metrics, setMetrics] = useState({ clicks: 0, conversions: 0, revenue: 0, ctr: 0 });
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [p, c, cp, u, cl, m] = await Promise.all([
        getProducts(), getCampaigns(), getCoupons(), getUtmLinks(), getClicks(100), getMetrics()
      ]);
      setProducts(p); setCampaigns(c); setCoupons(cp); setUtmLinks(u); setClicks(cl); setMetrics(m);
    } catch (e) {
      console.error(e);
      toast({ title: "Gagal memuat data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); toast({ title: "Disalin ke clipboard" }); }
    catch { toast({ title: "Gagal menyalin", variant: "destructive" }); }
  };

  // ===== Products =====
  const addProduct = async () => {
    try {
      const np = await createProduct({ name: "Produk Baru", category: "Lainnya", price: 0, commission: 10, active: true, url: "https://merchant.com/?ref=YOURID" });
      setProducts((s) => [np, ...s]);
    } catch (e) { toast({ title: "Gagal menambah produk", variant: "destructive" }); }
  };
  const updateProduct = async (id, patch) => {
    try {
      const updated = await apiUpdateProduct(id, patch);
      setProducts((s) => s.map((p) => (p.id === id ? updated : p)));
    } catch { toast({ title: "Gagal menyimpan", variant: "destructive" }); }
  };
  const removeProduct = async (id) => {
    try { await apiDeleteProduct(id); setProducts((s) => s.filter((p) => p.id !== id)); }
    catch { toast({ title: "Gagal menghapus", variant: "destructive" }); }
  };

  // ===== Campaigns =====
  const addCampaign = async () => {
    try {
      const today = new Date().toISOString().slice(0,10);
      const nc = await apiCreateCampaign({ name: "Kampanye Baru", budget: 0, status: "aktif", start: today, end: today, utm: { source: "seo", medium: "blog", campaign: "new_campaign" } });
      setCampaigns((s) => [nc, ...s]);
    } catch { toast({ title: "Gagal menambah kampanye", variant: "destructive" }); }
  };
  const updateCampaign = async (id, patch) => {
    try {
      const updated = await apiUpdateCampaign(id, patch);
      setCampaigns((s) => s.map((c) => (c.id === id ? updated : c)));
    } catch { toast({ title: "Gagal menyimpan", variant: "destructive" }); }
  };
  const removeCampaign = async (id) => {
    try { await apiDeleteCampaign(id); setCampaigns((s) => s.filter((c) => c.id !== id)); }
    catch { toast({ title: "Gagal menghapus", variant: "destructive" }); }
  };

  // ===== Coupons =====
  const addCoupon = async () => {
    try { const nc = await apiCreateCoupon({ code: "NEW10", discount: 10, usage: 0, active: true }); setCoupons((s)=>[nc, ...s]); }
    catch { toast({ title: "Gagal menambah kupon", variant: "destructive" }); }
  };
  const updateCoupon = async (id, patch) => {
    try { const updated = await apiUpdateCoupon(id, patch); setCoupons((s)=>s.map((c)=>c.id===id?updated:c)); }
    catch { toast({ title: "Gagal menyimpan", variant: "destructive" }); }
  };
  const removeCoupon = async (id) => {
    try { await apiDeleteCoupon(id); setCoupons((s)=>s.filter((c)=>c.id!==id)); }
    catch { toast({ title: "Gagal menghapus", variant: "destructive" }); }
  };

  // ===== UTM Builder =====
  const [form, setForm] = useState({ base: "https://yourblog.com/post", source: "seo", medium: "blog", campaign: "", term: "", content: "" });
  const setFormVal = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const buildUTM = async () => {
    const params = new URLSearchParams();
    if (form.source) params.set("utm_source", form.source);
    if (form.medium) params.set("utm_medium", form.medium);
    if (form.campaign) params.set("utm_campaign", form.campaign);
    if (form.term) params.set("utm_term", form.term);
    if (form.content) params.set("utm_content", form.content);
    const url = `${form.base}${form.base.includes("?")?"&":"?"}${params.toString()}`;
    try {
      const item = await createUtmLink({ title: form.campaign || form.source, url });
      setUtmLinks((s)=>[item, ...s]);
      toast({ title: "URL UTM dibuat" });
      navigator.clipboard.writeText(url).catch(()=>{});
    } catch { toast({ title: "Gagal membuat link", variant: "destructive" }); }
  };

  const currencyIDR = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n || 0);

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        {[{label: "Klik", value: clicks.length}, {label: "Konversi", value: metrics.conversions}, {label: "Pendapatan", value: currencyIDR(metrics.revenue)}, {label: "CTR", value: metrics.ctr + "%"}].map((m, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="text-sm text-stone-500">{m.label}</div>
              <div className="text-2xl font-semibold text-stone-900 mt-1">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-5">
          <SectionHeader title="Klik Terbaru" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Kampanye</TableHead>
                <TableHead>Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clicks.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{products.find(p => p.id===c.productId)?.name || c.productId}</TableCell>
                  <TableCell className="uppercase">{c.source}</TableCell>
                  <TableCell>{campaigns.find(k=>k.id===c.campaignId)?.name || c.campaignId}</TableCell>
                  <TableCell>{new Date(c.ts).toLocaleString("id-ID")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const Products = () => (
    <div className="space-y-4">
      <SectionHeader title="Produk Afiliasi" extra={<>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-stone-400" size={16} />
          <Input placeholder="Cari produk..." className="pl-8 w-64" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={addProduct}><Plus size={16} />Tambah</Button>
      </>} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Komisi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Input value={p.name} onChange={(e)=>updateProduct(p.id,{name:e.target.value})} />
                  </TableCell>
                  <TableCell>
                    <Input value={p.category} onChange={(e)=>updateProduct(p.id,{category:e.target.value})} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={p.price} onChange={(e)=>updateProduct(p.id,{price:Number(e.target.value)})} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input type="number" value={p.commission} onChange={(e)=>updateProduct(p.id,{commission:Number(e.target.value)})} />
                      <span className="text-sm text-stone-500">%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={p.active?"aktif":"nonaktif"} onValueChange={(v)=>updateProduct(p.id,{active: v==="aktif"})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input value={p.url} onChange={(e)=>updateProduct(p.id,{url:e.target.value})} />
                      <Button variant="outline" onClick={()=>copy(p.url)}><Copy size={14} /></Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button variant="destructive" onClick={()=>removeProduct(p.id)}><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const Campaigns = () => (
    <div className="space-y-4">
      <SectionHeader title="Kampanye" extra={<>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={addCampaign}><Plus size={16} />Tambah</Button>
      </>} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Selesai</TableHead>
                <TableHead>UTM</TableHead>
                <TableHead className="text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map(c => (
                <TableRow key={c.id}>
                  <TableCell><Input value={c.name} onChange={(e)=>updateCampaign(c.id,{name:e.target.value})} /></TableCell>
                  <TableCell><Input type="number" value={c.budget} onChange={(e)=>updateCampaign(c.id,{budget:Number(e.target.value)})} /></TableCell>
                  <TableCell>
                    <Select value={c.status} onValueChange={(v)=>updateCampaign(c.id,{status:v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="pause">Pause</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Input type="date" value={c.start} onChange={(e)=>updateCampaign(c.id,{start:e.target.value})} /></TableCell>
                  <TableCell><Input type="date" value={c.end} onChange={(e)=>updateCampaign(c.id,{end:e.target.value})} /></TableCell>
                  <TableCell>
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="source" value={c.utm.source} onChange={(e)=>updateCampaign(c.id,{utm:{...c.utm, source:e.target.value}})} />
                      <Input placeholder="medium" value={c.utm.medium} onChange={(e)=>updateCampaign(c.id,{utm:{...c.utm, medium:e.target.value}})} />
                      <Input placeholder="campaign" value={c.utm.campaign} onChange={(e)=>updateCampaign(c.id,{utm:{...c.utm, campaign:e.target.value}})} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button variant="destructive" onClick={()=>removeCampaign(c.id)}><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const UTMBuilder = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5 space-y-4">
          <SectionHeader title="UTM Builder" />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-stone-600">Base URL</label>
              <Input value={form.base} onChange={(e)=>setFormVal("base", e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-stone-600">Pilih Kampanye</label>
              <Select value={form.campaign} onValueChange={(v)=>setFormVal("campaign", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih kampanye (opsional)" /></SelectTrigger>
                <SelectContent>
                  {campaigns.map(c => <SelectItem key={c.id} value={c.utm.campaign}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-stone-600">Source</label>
              <Select value={form.source} onValueChange={(v)=>setFormVal("source", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['seo','newsletter','ads','social','referral'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-stone-600">Medium</label>
              <Select value={form.medium} onValueChange={(v)=>setFormVal("medium", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['blog','email','cpc','organic','influencer'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-stone-600">Term (opsional)</label>
              <Input value={form.term} onChange={(e)=>setFormVal("term", e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-stone-600">Content (opsional)</label>
              <Input value={form.content} onChange={(e)=>setFormVal("content", e.target.value)} />
            </div>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={buildUTM}><Wand2 size={16} />Buat & Salin URL</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <SectionHeader title="Link Tersimpan" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utmLinks.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.title}</TableCell>
                  <TableCell className="truncate max-w-[600px]"><a href={u.url} className="text-teal-700 hover:underline" target="_blank" rel="noreferrer">{u.url}</a></TableCell>
                  <TableCell className="text-right pr-4">
                    <Button variant="outline" onClick={()=>copy(u.url)}><Copy size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const Coupons = () => (
    <div className="space-y-4">
      <SectionHeader title="Kupon" extra={<>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={addCoupon}><Plus size={16} />Tambah</Button>
      </>} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Diskon</TableHead>
                <TableHead>Penggunaan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map(cp => (
                <TableRow key={cp.id}>
                  <TableCell><Input value={cp.code} onChange={(e)=>updateCoupon(cp.id,{code:e.target.value})} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2"><Input type="number" value={cp.discount} onChange={(e)=>updateCoupon(cp.id,{discount:Number(e.target.value)})} /><span className="text-sm text-stone-500">%</span></div>
                  </TableCell>
                  <TableCell>{cp.usage}</TableCell>
                  <TableCell>
                    <Select value={cp.active?"aktif":"nonaktif"} onValueChange={(v)=>updateCoupon(cp.id,{active:v==="aktif"})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button variant="destructive" onClick={()=>removeCoupon(cp.id)}><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const Exports = () => (
    <div className="space-y-4">
      <SectionHeader title="Ekspor Data" />
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <div className="font-medium">Unduh CSV Produk & Kampanye</div>
            <div className="text-sm text-stone-600">Data real dari backend.</div>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={()=>{ window.open(exportCSVUrl(), "_blank"); toast({ title: "CSV diekspor" }); }}><Download size={16} />Unduh CSV</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex">
        <Sidebar active={active} onChange={setActive} />
        <div className="flex-1">
          <div className="hidden md:flex h-14 items-center justify-between px-6 border-b bg-white sticky top-0 z-30">
            <div className="font-medium text-stone-700">Dashboard</div>
            <div className="text-xs text-stone-500">Terhubung backend</div>
          </div>
          <main className="p-4 md:p-6 max-w-6xl">
            {loading && <div className="text-sm text-stone-500 mb-4">Memuat data…</div>}
            {active === "overview" && <Overview />}
            {active === "products" && <Products />}
            {active === "campaigns" && <Campaigns />}
            {active === "utm" && <UTMBuilder />}
            {active === "coupons" && <Coupons />}
            {active === "exports" && <Exports />}
          </main>
        </div>
      </div>
    </div>
  );
}